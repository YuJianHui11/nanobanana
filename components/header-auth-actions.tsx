'use client'

import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type HeaderAuthActionsProps = {
  displayName: string | null
  isAuthenticated: boolean
}

export function HeaderAuthActions({ displayName, isAuthenticated }: HeaderAuthActionsProps) {
  if (isAuthenticated) {
    return (
      <>
        {displayName ? (
          <span className="hidden text-sm text-muted-foreground sm:inline-block">
            {displayName}
          </span>
        ) : null}
        <form action="/auth/logout" method="post">
          <input type="hidden" name="redirect_to" value="/" />
          <Button variant="outline" size="sm" type="submit">
            Sign Out
          </Button>
        </form>
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          Sign In
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        <DropdownMenuLabel>Continue with</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/auth/google" className="w-full">
            Google
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/auth/github" className="w-full">
            GitHub
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
