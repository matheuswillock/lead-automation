"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PageItem = number | "ellipsis"

export function buildPaginationItems(page: number, totalPages: number, siblings = 1): PageItem[] {
  const totalSlots = siblings * 2 + 5
  if (totalPages <= totalSlots) return Array.from({ length: totalPages }, (_, index) => index + 1)

  const leftSibling = Math.max(page - siblings, 2)
  const rightSibling = Math.min(page + siblings, totalPages - 1)
  const items: PageItem[] = [1]

  if (leftSibling > 2) items.push("ellipsis")
  else for (let item = 2; item < leftSibling; item += 1) items.push(item)
  for (let item = leftSibling; item <= rightSibling; item += 1) items.push(item)
  if (rightSibling < totalPages - 1) items.push("ellipsis")
  else for (let item = rightSibling + 1; item < totalPages; item += 1) items.push(item)

  items.push(totalPages)
  return items
}

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  siblings?: number
  className?: string
}

export function Pagination({ page, totalPages, onPageChange, siblings = 1, className }: PaginationProps) {
  const shouldReduceMotion = useReducedMotion()
  const paginationId = React.useId()
  const pageItems = React.useMemo(() => buildPaginationItems(page, totalPages, siblings), [page, siblings, totalPages])

  if (totalPages <= 1) return null

  return (
    <nav aria-label="Paginação dos resultados" className={cn("flex w-full justify-center", className)}>
      <ul className="flex items-center gap-1">
        <li>
          <Button type="button" variant="ghost" size="sm" aria-label="Ir para a página anterior" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>
        </li>

        {pageItems.map((item, index) => {
          if (item === "ellipsis") {
            return <li key={`ellipsis-${index}`} aria-hidden="true" className="flex size-9 items-center justify-center text-muted-foreground">…</li>
          }

          const isActive = item === page
          return (
            <motion.li
              key={item}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.05, duration: 0.25, delay: index * 0.03 }}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-current={isActive ? "page" : undefined}
                aria-label={`Ir para a página ${item}`}
                className={cn("relative", isActive ? "text-foreground" : "text-muted-foreground")}
                onClick={() => onPageChange(item)}
              >
                {isActive && (
                  <motion.span
                    layoutId={`pagination-active-${paginationId}`}
                    className="absolute inset-0 rounded-md border bg-background shadow-sm"
                    transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.05, duration: 0.25 }}
                  />
                )}
                <span className="relative z-10">{item}</span>
              </Button>
            </motion.li>
          )
        })}

        <li>
          <Button type="button" variant="ghost" size="sm" aria-label="Ir para a próxima página" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            <span className="hidden sm:inline">Próxima</span>
            <ChevronRight className="size-4" />
          </Button>
        </li>
      </ul>
    </nav>
  )
}
