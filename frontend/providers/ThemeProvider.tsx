"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Appearance } from "react-native"

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
  colors: {
    background: string
    foreground: string
    primary: string
    secondary: string
    muted: string
    border: string
    card: string
    accent: string
    destructive: string
    success: string
    warning: string
  }
}

const lightColors = {
  background: "#f8fafc",
  foreground: "#0f172a",
  primary: "#1e40af",
  secondary: "#f1f5f9",
  muted: "#f8fafc",
  border: "#e2e8f0",
  card: "#ffffff",
  accent: "#e2e8f0",
  destructive: "#dc2626",
  success: "#059669",
  warning: "#d97706",
}

const darkColors = {
  background: "#020617",
  foreground: "#f8fafc",
  primary: "#3b82f6",
  secondary: "#1e293b",
  muted: "#0f172a",
  border: "#334155",
  card: "#0f172a",
  accent: "#1e293b",
  destructive: "#dc2626",
  success: "#10b981",
  warning: "#f59e0b",
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Use system theme as default
    const systemTheme = Appearance.getColorScheme() === "dark"
    setIsDark(systemTheme)

    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === "dark")
    })

    return () => subscription?.remove()
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const colors = isDark ? darkColors : lightColors

  return <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
