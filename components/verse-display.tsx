"use client";

import { useState, useEffect } from "react";
import { type Verse, getVerses } from "@/lib/bible-service";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface VerseDisplayProps {
  chapterId: string;
  bibleId: string;
}

export default function VerseDisplay({
  chapterId,
  bibleId,
}: VerseDisplayProps) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [copyright, setCopyright] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    async function fetchVerses() {
      try {
        setLoading(true);
        setError(null);

        const { verses, copyright, isFallback } = await getVerses(
          chapterId,
          bibleId
        );
        setVerses(verses);
        setCopyright(copyright);
        setUsingFallback(isFallback);

        if (verses.length === 0) {
          console.warn("No verses returned from API");
        }
      } catch (err) {
        console.error("Failed to fetch verses:", err);
        setError("Failed to load Bible verses. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchVerses();
  }, [chapterId, bibleId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="flex">
            <Skeleton className="h-6 w-6 mr-2" />
            <Skeleton className="h-6 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (verses.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold">
          No verses found for this chapter.
        </h3>
        <p className="text-muted-foreground mt-2">
          This could be due to an API limitation or incorrect chapter reference.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {usingFallback && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Using Offline Data</AlertTitle>
          <AlertDescription>
            We couldn't connect to the Bible API, so we're showing fallback
            content.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 text-lg leading-relaxed">
        {verses.map((verse) => (
          <div key={verse.id} className="group flex">
            <span className="mr-2 text-sm text-muted-foreground pt-1 w-6 text-right">
              {verse.number}
            </span>
            <p className="flex-1">
              {verse.text}
              <span className="ml-2 opacity-0 group-hover:opacity-100 text-sm text-muted-foreground">
                <button className="hover:text-primary">Highlight</button> ·
                <button className="ml-1 hover:text-primary">Share</button> ·
                <button className="ml-1 hover:text-primary">Bookmark</button>
              </span>
            </p>
          </div>
        ))}
        {copyright && (
          <div className="text-xs text-muted-foreground mt-8 pt-4 border-t">
            {copyright}
          </div>
        )}
      </div>
    </div>
  );
}
