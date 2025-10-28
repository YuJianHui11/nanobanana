import { promises as fs } from "fs"
import { NextResponse } from "next/server"
import path from "path"

type OpenRouterContentPart =
  | { type: "text"; text: string }
  | { type: "input_text"; text: string }
  | { type: "image_url"; image_url: { url: string } }
  | { type: "input_image"; image_base64: string }
  | { type: "generated_image"; generated_image: string }
  | { type: string; image_base64?: string }

type ImageCandidate = {
  value: string
  path: string
}

const MODEL_ID = "google/gemini-2.5-flash-image"
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"
const MAX_LOG_LENGTH = 160
const BASE64_REGEX = /^[A-Za-z0-9+/=\r\n]+$/

const EXTENSION_TO_MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
}

function truncateForLog(value: string | null | undefined) {
  if (!value) return value
  if (value.length <= MAX_LOG_LENGTH) return value
  return `${value.slice(0, MAX_LOG_LENGTH)}...(${value.length} chars)`
}

async function readFileAsDataURL(filePath: string) {
  try {
    const resolvedPath = path.resolve(filePath)
    const buffer = await fs.readFile(resolvedPath)
    const ext = path.extname(resolvedPath).toLowerCase()
    const mimeType = EXTENSION_TO_MIME[ext] || "image/png"
    return `data:${mimeType};base64,${buffer.toString("base64")}`
  } catch (error) {
    console.warn("[api/generate] Unable to read generated image file:", filePath, error)
    return null
  }
}

function normalizeImageCandidate(value: unknown): string | null {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  if (trimmed.startsWith("data:image")) {
    return trimmed
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  if (trimmed.startsWith("/")) {
    return trimmed
  }

  const compact = trimmed.replace(/\s+/g, "")
  if (compact.length > 64 && BASE64_REGEX.test(compact)) {
    return `data:image/png;base64,${compact}`
  }

  return null
}

function collectImageCandidates(
  node: unknown,
  path: (string | number)[] = [],
  results: ImageCandidate[] = [],
): ImageCandidate[] {
  if (typeof node === "string") {
    const normalized = normalizeImageCandidate(node)
    if (normalized) {
      const pathLabel =
        path
          .map((segment) => (typeof segment === "number" ? `[${segment}]` : segment))
          .join(".") || "(root)"
      results.push({ value: normalized, path: pathLabel })
    }
    return results
  }

  if (Array.isArray(node)) {
    node.forEach((item, index) => {
      collectImageCandidates(item, [...path, index], results)
    })
    return results
  }

  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      collectImageCandidates(value, [...path, key], results)
    }
  }

  return results
}

export async function POST(request: Request) {
  try {
    const { prompt, image } = (await request.json()) as {
      prompt?: string
      image?: string
    }

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
    }

    if (!image || !image.startsWith("data:image")) {
      return NextResponse.json({ error: "Image upload is required." }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OpenRouter API key." }, { status: 500 })
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    }

    if (process.env.OPENROUTER_SITE_URL) {
      headers["HTTP-Referer"] = process.env.OPENROUTER_SITE_URL
    }

    if (process.env.OPENROUTER_SITE_NAME) {
      headers["X-Title"] = process.env.OPENROUTER_SITE_NAME
    }

    console.log("[api/generate] Sending request", {
      model: MODEL_ID,
      promptPreview: truncateForLog(prompt.trim()),
      imagePreview: truncateForLog(image.slice(0, 80)),
    })

    const base64Image = image.split(",")[1] ?? ""

    const content = [
      {
        type: "input_text",
        text: prompt.trim(),
      },
      {
        type: "text",
        text: `Generate a new image based on the provided reference. Follow the user's instructions closely: ${prompt.trim()}`,
      },
      {
        type: "image_url",
        image_url: {
          url: image,
        },
      },
      base64Image
        ? ({
            type: "input_image",
            image_base64: base64Image,
          } as OpenRouterContentPart)
        : null,
    ].filter(Boolean) as OpenRouterContentPart[]

    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: "You are an image generation model. Always return at least one generated image encoded as base64 (data:image/png;base64,...) and avoid textual descriptions.",
              },
            ],
          },
          {
            role: "user",
            content,
          },
        ],
      }),
    })

    console.log("[api/generate] Upstream response status", response.status)

    if (!response.ok) {
      const errorPayload = await response.text()
      console.error("[api/generate] Upstream non-200 response", {
        status: response.status,
        bodyPreview: truncateForLog(errorPayload),
      })
      return NextResponse.json(
        { error: "Upstream request failed.", details: errorPayload },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("[api/generate] Upstream response body", truncateForLog(JSON.stringify(data)))
    const choiceSummaries =
      data?.choices?.slice?.(0, 2).map((choice: any, index: number) => {
        const rawContent = choice?.message?.content
        let preview: string

        if (Array.isArray(rawContent)) {
          preview = JSON.stringify(rawContent.slice(0, 2))
        } else if (rawContent && typeof rawContent === "object") {
          preview = JSON.stringify(rawContent)
        } else {
          preview = String(rawContent)
        }

        return {
          index,
          contentType: Array.isArray(rawContent)
            ? "array"
            : rawContent && typeof rawContent === "object"
              ? "object"
              : typeof rawContent,
          preview: truncateForLog(preview),
        }
      }) ?? []

    console.log("[api/generate] Choice content summaries", choiceSummaries)
    const dataEntriesSummary =
      Array.isArray(data?.data)
        ? data.data.slice(0, 3).map((entry: any, index: number) => ({
            index,
            keys: Object.keys(entry ?? {}),
            preview: truncateForLog(
              typeof entry?.b64_json === "string"
                ? entry.b64_json.slice(0, 80)
                : JSON.stringify(entry ?? {}),
            ),
          }))
        : []
    console.log("[api/generate] Data array summary", {
      length: Array.isArray(data?.data) ? data.data.length : 0,
      entries: dataEntriesSummary,
    })

    const imageCandidates = collectImageCandidates(data)
    const uniqueCandidatesMap = new Map<string, ImageCandidate>()
    imageCandidates.forEach((candidate) => {
      if (!uniqueCandidatesMap.has(candidate.value)) {
        uniqueCandidatesMap.set(candidate.value, candidate)
      }
    })

    const uploadedImageNormalized = normalizeImageCandidate(image) ?? image

    const uniqueCandidates = Array.from(uniqueCandidatesMap.values()).filter(
      (candidate) => candidate.value !== uploadedImageNormalized,
    )

    console.log("[api/generate] Image candidate summary", {
      total: uniqueCandidates.length,
      samples: uniqueCandidates.slice(0, 3).map((candidate) => ({
        path: candidate.path,
        preview: truncateForLog(candidate.value),
      })),
    })

    const localCandidates = uniqueCandidates.filter((candidate) => candidate.value.startsWith("/"))
    const remoteOrDataCandidates = uniqueCandidates.filter(
      (candidate) => !candidate.value.startsWith("/"),
    )

    const convertedLocalImages = await Promise.all(
      localCandidates.map(async (candidate) => {
        const converted = await readFileAsDataURL(candidate.value)
        return converted ? { converted, path: candidate.path } : null
      }),
    )

    const resolvedLocalImages = convertedLocalImages
      .filter((item): item is { converted: string; path: string } => Boolean(item))
      .map((item) => item.converted)

    const allImages = Array.from(
      new Set([
        ...remoteOrDataCandidates.map((candidate) => candidate.value),
        ...resolvedLocalImages,
      ]),
    )

    if (!allImages.length) {
      console.log("[api/generate] No usable images found in response.")
      return NextResponse.json({ error: "No images returned from the model." }, { status: 502 })
    }

    console.log("[api/generate] Returning images", {
      count: allImages.length,
      summaries: allImages.map((entry) => truncateForLog(entry)).slice(0, 3),
    })

    return NextResponse.json({ images: allImages })
  } catch (error) {
    console.error("[api/generate] Failed", error)
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 })
  }
}
