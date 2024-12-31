"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

export function ThemeSwitcher() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="min-w-[8rem] rounded-md border bg-white p-1 shadow-md dark:bg-gray-950 dark:border-gray-800 z-999" align="end">
          <DropdownMenu.Item 
            className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-800 z-999"
            onClick={() => setTheme("light")}
          >
            <Sun className="mr-2 h-4 w-4" />
            Light
          </DropdownMenu.Item>
          <DropdownMenu.Item 
            className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setTheme("dark")}
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </DropdownMenu.Item>
          <DropdownMenu.Item 
            className="flex cursor-pointer items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setTheme("system")}
          >
            <Monitor className="mr-2 h-4 w-4" />
            System
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
