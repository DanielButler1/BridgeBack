import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatStatusLabel(status: string) {
  const label = status.replaceAll("_", " ")

  return label.charAt(0).toUpperCase() + label.slice(1)
}
