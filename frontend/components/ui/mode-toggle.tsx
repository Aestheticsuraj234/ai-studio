"use client"

import { RiMoonLine, RiSunLine } from "@remixicon/react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
   
    >
      {isDark ? (
        <RiSunLine className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <RiMoonLine className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  )
}