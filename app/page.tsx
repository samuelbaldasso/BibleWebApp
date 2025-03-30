"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Menu, Search } from "lucide-react";
import {
  getBookNameFromChapterId,
  getChapterNumberFromChapterId,
  getNextChapterId,
  getPreviousChapterId,
  getChapters,
  DEFAULT_BIBLE_ID,
} from "@/lib/bible-service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import BibleNavigation from "@/components/bible-navigation";
import VerseDisplay from "@/components/verse-display";
import ChapterSelector from "@/components/chapter-selector";
import BibleVersionSelector from "@/components/bible-version-selector";

export default function BibleApp() {
  const [bibleId, setBibleId] = useState(DEFAULT_BIBLE_ID);
  const [bookId, setBookId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [bookName, setBookName] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle book selection
  const handleBookSelect = async (selectedBookId: string) => {
    try {
      setLoading(true);
      const chapters = await getChapters(selectedBookId, bibleId);
      if (chapters.length > 0) {
        setBookId(selectedBookId);
        setChapterId(chapters[0].id);
        // Update book name and chapter number
        setBookName(chapters[0].id.split(".")[0]);
        setChapterNumber(chapters[0].number);
      }
    } catch (error) {
      console.error("Failed to handle book selection:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle chapter selection
  const handleChapterSelect = (selectedChapterId: string) => {
    setChapterId(selectedChapterId);
    setBookId(getBookNameFromChapterId(selectedChapterId));
    setChapterNumber(getChapterNumberFromChapterId(selectedChapterId));
  };

  // Handle Bible version selection
  const handleVersionSelect = (selectedBibleId: string) => {
    setBibleId(selectedBibleId);
  };

  // Handle navigation to previous chapter
  const handlePreviousChapter = async () => {
    if (!chapterId) return; // Don't navigate if no chapter is selected

    try {
      setLoading(true);
      const prevChapterId = await getPreviousChapterId(chapterId, bibleId);
      if (prevChapterId) {
        setChapterId(prevChapterId);
        setBookId(getBookNameFromChapterId(prevChapterId));
        setBookName(getBookNameFromChapterId(prevChapterId));
        setChapterNumber(getChapterNumberFromChapterId(prevChapterId));
      }
    } catch (error) {
      console.error("Failed to navigate to previous chapter:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation to next chapter
  const handleNextChapter = async () => {
    if (!chapterId) return; // Don't navigate if no chapter is selected

    try {
      setLoading(true);
      const nextChapterId = await getNextChapterId(chapterId, bibleId);
      if (nextChapterId) {
        setChapterId(nextChapterId);
        setBookId(getBookNameFromChapterId(nextChapterId));
        setBookName(getBookNameFromChapterId(nextChapterId));
        setChapterNumber(getChapterNumberFromChapterId(nextChapterId));
      }
    } catch (error) {
      console.error("Failed to navigate to next chapter:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update book name when chapter ID changes
  useEffect(() => {
    if (chapterId) {
      const bookId = getBookNameFromChapterId(chapterId);
      const chapterNum = getChapterNumberFromChapterId(chapterId);
      setBookName(bookId);
      setChapterNumber(chapterNum);
    }
  }, [chapterId]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-14 items-center px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <BibleNavigation
                bibleId={bibleId}
                onSelectBook={handleBookSelect}
                activeBookId={bookId}
              />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Bible App</h1>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <aside className="hidden border-r md:block">
            <div className="sticky top-14 overflow-y-auto py-6 pr-4 lg:py-8">
              <BibleNavigation
                bibleId={bibleId}
                onSelectBook={handleBookSelect}
                activeBookId={bookId}
              />
            </div>
          </aside>
          <div className="p-4 md:p-8">
            {chapterId ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePreviousChapter}
                      disabled={loading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center">
                      {loading ? (
                        <Skeleton className="h-8 w-32" />
                      ) : (
                        <h2 className="text-2xl font-bold">
                          {bookName} {chapterNumber}
                        </h2>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextChapter}
                      disabled={loading}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <ChapterSelector
                      bookId={bookId}
                      bibleId={bibleId}
                      onSelectChapter={handleChapterSelect}
                      activeChapterId={chapterId}
                    />
                    <BibleVersionSelector
                      onSelectVersion={handleVersionSelect}
                      activeBibleId={bibleId}
                    />
                  </div>
                </div>

                <Tabs defaultValue="read" className="mb-4">
                  <TabsList>
                    <TabsTrigger value="read">Read</TabsTrigger>
                    <TabsTrigger value="study">Study</TabsTrigger>
                    <TabsTrigger value="compare">Compare</TabsTrigger>
                  </TabsList>
                  <TabsContent value="read" className="mt-4">
                    <VerseDisplay chapterId={chapterId} bibleId={bibleId} />
                  </TabsContent>
                  <TabsContent value="study" className="mt-4">
                    <div className="text-center py-8 text-muted-foreground">
                      Study tools will appear here
                    </div>
                  </TabsContent>
                  <TabsContent value="compare" className="mt-4">
                    <div className="text-center py-8 text-muted-foreground">
                      Translation comparison will appear here
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[70vh]">
                <div className="text-center space-y-4 max-w-md">
                  <h2 className="text-2xl font-bold">Welcome to Bible App</h2>
                  <p className="text-muted-foreground">
                    Select a book from the navigation menu to start reading
                  </p>
                  <div className="flex items-center justify-center mt-4">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button className="md:hidden">Open Navigation</Button>
                      </SheetTrigger>
                      <SheetContent
                        side="left"
                        className="w-[300px] sm:w-[400px]"
                      >
                        <BibleNavigation
                          bibleId={bibleId}
                          onSelectBook={handleBookSelect}
                          activeBookId={bookId}
                        />
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
