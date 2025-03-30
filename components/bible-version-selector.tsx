"use client"

import { useState, useEffect } from "react"
import { type BibleVersion, getBibleVersions } from "@/lib/bible-service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

interface BibleVersionSelectorProps {
  onSelectVersion: (bibleId: string) => void
  activeBibleId: string
}

export default function BibleVersionSelector({ onSelectVersion, activeBibleId }: BibleVersionSelectorProps) {
  const [versions, setVersions] = useState<BibleVersion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVersions() {
      try {
        setLoading(true)
        const versionsData = await getBibleVersions()
        setVersions(versionsData)
      } catch (error) {
        console.error("Failed to fetch Bible versions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVersions()
  }, [])

  if (loading) {
    return <Skeleton className="h-10 w-20" />
  }

  if (versions.length === 0) {
    return <div>No versions available</div>
  }

  // Find active version
  const activeVersion = versions.find((v) => v.id === activeBibleId) || versions[0]

  return (
    <Select defaultValue={activeBibleId} onValueChange={onSelectVersion}>
      <SelectTrigger className="w-24">
        <SelectValue>{activeVersion.abbreviation}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {versions.map((version) => (
          <SelectItem key={version.id} value={version.id}>
            {version.abbreviation} - {version.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

