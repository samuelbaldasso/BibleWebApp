"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { type Book, getBooks } from "@/lib/bible-service";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface BibleNavigationProps {
  bibleId: string;
  onSelectBook: (bookId: string) => void;
  activeBookId?: string;
}

export default function BibleNavigation({
  bibleId,
  onSelectBook,
  activeBookId,
}: BibleNavigationProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooks, setShowBooks] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        const booksData = await getBooks(bibleId);
        setBooks(booksData);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [bibleId]);

  const booksNew = books.filter((book) => book.testament === "NT");

  if (loading) {
    return (
      <div className="space-y-4 py-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Bible
        </h2>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => setShowBooks(!showBooks)}
          >
            <span>BOOKS</span>
            {showBooks ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          {showBooks && (
            <div className="space-y-1 pl-6">
              {booksNew.map((book) => (
                <Button
                  key={book.id}
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start ${
                    activeBookId === book.id ? "bg-muted" : ""
                  }`}
                  onClick={() => onSelectBook(book.id)}
                >
                  {book.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
