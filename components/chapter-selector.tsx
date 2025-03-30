"use client"

import { useState, useEffect } from "react"
import { type Chapter, getChapters } from "@/lib/bible-service"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface ChapterSelectorProps {
  bookId: string
  bibleId: string
  onSelectChapter: (chapterId: string) => void
  activeChapterId?: string
}

export default function ChapterSelector({ bookId, bibleId, onSelectChapter, activeChapterId }: ChapterSelectorProps) {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchChapters() {
      if (!bookId) return

      try {
        setLoading(true)
        const chaptersData = await getChapters(bookId, bibleId)
        setChapters(chaptersData)
      } catch (error) {
        console.error("Failed to fetch chapters:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChapters()
  }, [bookId, bibleId])

  // Get active chapter number
  const activeChapterNumber = activeChapterId
    ? activeChapterId.split(".")[1]
    : chapters.length > 0
      ? chapters[0].number
      : "1"

  if (loading) {
    return <Skeleton className="h-10 w-24" />
  }

  if (chapters.length === 0) {
    return <div>No chapters available</div>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-36">
          Chapter {activeChapterNumber}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-64 p-2">
        <div className="grid grid-cols-5 gap-2">
          {chapters.map((chapter) => (
            <DropdownMenuItem
              key={chapter.id}
              className={`justify-center ${activeChapterId === chapter.id ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => onSelectChapter(chapter.id)}
            >
              {chapter.number}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

