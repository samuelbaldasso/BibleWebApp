// Bible API service

// We're using the free API.Bible service
const API_URL = "https://api.scripture.api.bible/v1"
// This is a public API key for demo purposes only
const API_KEY = "3e0a9223f17008424875f35c98919800"

// Default Bible ID (ESV)
export const DEFAULT_BIBLE_ID = "9879dbb7cfe39e4d-01"

export type BibleVersion = {
  id: string
  name: string
  abbreviation: string
}

export type Book = {
  id: string
  name: string
  testament: "OT" | "NT"
}

export type Chapter = {
  id: string
  number: string
  bookId: string
}

export type Verse = {
  id: string
  number: string
  text: string
}

// Fallback data in case API fails
const FALLBACK_VERSIONS: BibleVersion[] = [
  { id: "kjv", name: "King James Version", abbreviation: "KJV" },
  { id: "niv", name: "New International Version", abbreviation: "NIV" },
  { id: "esv", name: "English Standard Version", abbreviation: "ESV" },
  { id: "nlt", name: "New Living Translation", abbreviation: "NLT" },
]

const FALLBACK_BOOKS: Book[] = [
  // Old Testament
  { id: "GEN", name: "Genesis", testament: "OT" },
  { id: "EXO", name: "Exodus", testament: "OT" },
  { id: "LEV", name: "Leviticus", testament: "OT" },
  { id: "NUM", name: "Numbers", testament: "OT" },
  { id: "DEU", name: "Deuteronomy", testament: "OT" },
  { id: "JOS", name: "Joshua", testament: "OT" },
  { id: "JDG", name: "Judges", testament: "OT" },
  { id: "RUT", name: "Ruth", testament: "OT" },
  { id: "1SA", name: "1 Samuel", testament: "OT" },
  { id: "2SA", name: "2 Samuel", testament: "OT" },
  { id: "1KI", name: "1 Kings", testament: "OT" },
  { id: "2KI", name: "2 Kings", testament: "OT" },
  { id: "1CH", name: "1 Chronicles", testament: "OT" },
  { id: "2CH", name: "2 Chronicles", testament: "OT" },
  { id: "EZR", name: "Ezra", testament: "OT" },
  { id: "NEH", name: "Nehemiah", testament: "OT" },
  { id: "EST", name: "Esther", testament: "OT" },
  { id: "JOB", name: "Job", testament: "OT" },
  { id: "PSA", name: "Psalms", testament: "OT" },
  { id: "PRO", name: "Proverbs", testament: "OT" },
  { id: "ECC", name: "Ecclesiastes", testament: "OT" },
  { id: "SNG", name: "Song of Solomon", testament: "OT" },
  { id: "ISA", name: "Isaiah", testament: "OT" },
  { id: "JER", name: "Jeremiah", testament: "OT" },
  { id: "LAM", name: "Lamentations", testament: "OT" },
  { id: "EZK", name: "Ezekiel", testament: "OT" },
  { id: "DAN", name: "Daniel", testament: "OT" },
  { id: "HOS", name: "Hosea", testament: "OT" },
  { id: "JOL", name: "Joel", testament: "OT" },
  { id: "AMO", name: "Amos", testament: "OT" },
  { id: "OBA", name: "Obadiah", testament: "OT" },
  { id: "JON", name: "Jonah", testament: "OT" },
  { id: "MIC", name: "Micah", testament: "OT" },
  { id: "NAM", name: "Nahum", testament: "OT" },
  { id: "HAB", name: "Habakkuk", testament: "OT" },
  { id: "ZEP", name: "Zephaniah", testament: "OT" },
  { id: "HAG", name: "Haggai", testament: "OT" },
  { id: "ZEC", name: "Zechariah", testament: "OT" },
  { id: "MAL", name: "Malachi", testament: "OT" },
  // New Testament
  { id: "MAT", name: "Matthew", testament: "NT" },
  { id: "MRK", name: "Mark", testament: "NT" },
  { id: "LUK", name: "Luke", testament: "NT" },
  { id: "JHN", name: "John", testament: "NT" },
  { id: "ACT", name: "Acts", testament: "NT" },
  { id: "ROM", name: "Romans", testament: "NT" },
  { id: "1CO", name: "1 Corinthians", testament: "NT" },
  { id: "2CO", name: "2 Corinthians", testament: "NT" },
  { id: "GAL", name: "Galatians", testament: "NT" },
  { id: "EPH", name: "Ephesians", testament: "NT" },
  { id: "PHP", name: "Philippians", testament: "NT" },
  { id: "COL", name: "Colossians", testament: "NT" },
  { id: "1TH", name: "1 Thessalonians", testament: "NT" },
  { id: "2TH", name: "2 Thessalonians", testament: "NT" },
  { id: "1TI", name: "1 Timothy", testament: "NT" },
  { id: "2TI", name: "2 Timothy", testament: "NT" },
  { id: "TIT", name: "Titus", testament: "NT" },
  { id: "PHM", name: "Philemon", testament: "NT" },
  { id: "HEB", name: "Hebrews", testament: "NT" },
  { id: "JAS", name: "James", testament: "NT" },
  { id: "1PE", name: "1 Peter", testament: "NT" },
  { id: "2PE", name: "2 Peter", testament: "NT" },
  { id: "1JN", name: "1 John", testament: "NT" },
  { id: "2JN", name: "2 John", testament: "NT" },
  { id: "3JN", name: "3 John", testament: "NT" },
  { id: "JUD", name: "Jude", testament: "NT" },
  { id: "REV", name: "Revelation", testament: "NT" },
]

// Generate chapters for a book (fallback)
function generateFallbackChapters(bookId: string): Chapter[] {
  const chapterCounts: Record<string, number> = {
    // Old Testament
    GEN: 50,
    EXO: 40,
    LEV: 27,
    NUM: 36,
    DEU: 34,
    JOS: 24,
    JDG: 21,
    RUT: 4,
    "1SA": 31,
    "2SA": 24,
    "1KI": 22,
    "2KI": 25,
    "1CH": 29,
    "2CH": 36,
    EZR: 10,
    NEH: 13,
    EST: 10,
    JOB: 42,
    PSA: 150,
    PRO: 31,
    ECC: 12,
    SNG: 8,
    ISA: 66,
    JER: 52,
    LAM: 5,
    EZK: 48,
    DAN: 12,
    HOS: 14,
    JOL: 3,
    AMO: 9,
    OBA: 1,
    JON: 4,
    MIC: 7,
    NAM: 3,
    HAB: 3,
    ZEP: 3,
    HAG: 2,
    ZEC: 14,
    MAL: 4,
    // New Testament
    MAT: 28,
    MRK: 16,
    LUK: 24,
    JHN: 21,
    ACT: 28,
    ROM: 16,
    "1CO": 16,
    "2CO": 13,
    GAL: 6,
    EPH: 6,
    PHP: 4,
    COL: 4,
    "1TH": 5,
    "2TH": 3,
    "1TI": 6,
    "2TI": 4,
    TIT: 3,
    PHM: 1,
    HEB: 13,
    JAS: 5,
    "1PE": 5,
    "2PE": 3,
    "1JN": 5,
    "2JN": 1,
    "3JN": 1,
    JUD: 1,
    REV: 22,
  }

  const count = chapterCounts[bookId] || 1
  return Array.from({ length: count }, (_, i) => ({
    id: `${bookId}.${i + 1}`,
    number: String(i + 1),
    bookId,
  }))
}

// Get available Bible versions
export async function getBibleVersions(): Promise<BibleVersion[]> {
  try {
    const response = await fetch(`${API_URL}/bibles`, {
      headers: {
        "api-key": API_KEY,
      },
    })

    if (!response.ok) {
      console.warn("Using fallback Bible versions due to API error")
      return FALLBACK_VERSIONS
    }

    const data = await response.json()
    return data.data.map((bible: any) => ({
      id: bible.id,
      name: bible.name,
      abbreviation: bible.abbreviationLocal || bible.abbreviation,
    }))
  } catch (error) {
    console.warn("Using fallback Bible versions due to error:", error)
    return FALLBACK_VERSIONS
  }
}

// Get books of the Bible
export async function getBooks(bibleId: string = DEFAULT_BIBLE_ID): Promise<Book[]> {
  try {
    const response = await fetch(`${API_URL}/bibles/${bibleId}/books`, {
      headers: {
        "api-key": API_KEY,
      },
    })

    if (!response.ok) {
      console.warn("Using fallback books due to API error")
      return FALLBACK_BOOKS
    }

    const data = await response.json()
    return data.data.map((book: any) => ({
      id: book.id,
      name: book.name,
      testament: book.testament === "OT" ? "OT" : "NT",
    }))
  } catch (error) {
    console.warn("Using fallback books due to error:", error)
    return FALLBACK_BOOKS
  }
}

// Get chapters for a book
export async function getChapters(bookId: string, bibleId: string = DEFAULT_BIBLE_ID): Promise<Chapter[]> {
  try {
    const response = await fetch(`${API_URL}/bibles/${bibleId}/books/${bookId}/chapters`, {
      headers: {
        "api-key": API_KEY,
      },
    })

    if (!response.ok) {
      console.warn(`Using fallback chapters for ${bookId} due to API error`)
      return generateFallbackChapters(bookId)
    }

    const data = await response.json()
    return data.data
      .filter((chapter: any) => chapter.id !== `${bookId}.intro`)
      .map((chapter: any) => ({
        id: chapter.id,
        number: chapter.number,
        bookId: bookId,
      }))
  } catch (error) {
    console.warn(`Using fallback chapters for ${bookId} due to error:`, error)
    return generateFallbackChapters(bookId)
  }
}

export async function getVerses(
  chapterId: string,
  bibleId: string = DEFAULT_BIBLE_ID,
): Promise<{ verses: Verse[]; copyright: string; isFallback: boolean }> {
  try {
    const response = await fetch(
      `${API_URL}/bibles/${bibleId}/chapters/${chapterId}?content-type=json&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true`,
      {
        headers: {
          "api-key": API_KEY,
        },
      },
    )

    if (!response.ok) {
      console.warn(`Using fallback verses for ${chapterId} due to API error`)
      return {
        verses: generateFallbackVerses(chapterId),
        copyright: "Fallback data for demonstration purposes only.",
        isFallback: true
      }
    }

    const data = await response.json()

    // The structure is different than expected - need to extract verses from content
    if (!data.data || !data.data.content) {
      console.warn(`Malformed API response for ${chapterId}, using fallback`)
      return {
        verses: generateFallbackVerses(chapterId),
        copyright: "Fallback data for demonstration purposes only.",
        isFallback: true
      }
    }

    // New extraction logic for nested content structure
    const verses: Verse[] = []
    let currentVerseNumber = ""

    // Process the nested content structure
    data.data.content.forEach((paraBlock: any) => {
      if (paraBlock.items && Array.isArray(paraBlock.items)) {
        paraBlock.items.forEach((item: any) => {
          // Check if this is a verse marker
          if (item.name === 'verse' && item.attrs && item.attrs.number) {
            currentVerseNumber = item.attrs.number
          }

          // Check if this is text content
          if (item.type === 'text' && currentVerseNumber) {
            verses.push({
              id: `${chapterId}.${currentVerseNumber}`,
              number: currentVerseNumber,
              text: item.text
            })
          }
        })
      }
    })

    // Sort verses by number (convert to number for proper sorting)
    verses.sort((a, b) => Number(a.number) - Number(b.number))

    // Remove duplicates (in case multiple text nodes have the same verse number)
    const uniqueVerses = verses.filter((verse, index, self) =>
      index === self.findIndex((v) => v.number === verse.number)
    )

    return {
      verses: uniqueVerses,
      copyright: data.data.copyright || "",
      isFallback: false
    }
  } catch (error) {
    console.warn(`Using fallback verses for ${chapterId} due to error:`, error)
    return {
      verses: generateFallbackVerses(chapterId),
      copyright: "Fallback data for demonstration purposes only.",
      isFallback: true
    }
  }
}

function generateFallbackVerses(chapterId: string): Verse[] {
  const parts = chapterId.split(".")
  const bookId = parts[0]
  const chapterNumber = parseInt(parts[1], 10)

  const verses = Array.from({ length: 10 }, (_, i) => ({
    id: `${bookId}.${chapterNumber}.${i + 1}`,
    number: String(i + 1),
    text: `Fallback verse ${i + 1} for ${bookId} ${chapterNumber}`,
  }))

  return verses;
}

// Get book name from chapter ID
export function getBookNameFromChapterId(chapterId: string): string {
  const parts = chapterId.split(".")
  return parts[0]
}

// Get chapter number from chapter ID
export function getChapterNumberFromChapterId(chapterId: string): string {
  const parts = chapterId.split(".")
  return parts[1]
}

// Get next chapter ID
export async function getNextChapterId(
  currentChapterId: string,
  bibleId: string = DEFAULT_BIBLE_ID,
): Promise<string | null> {
  try {
    const bookId = getBookNameFromChapterId(currentChapterId)
    const chapters = await getChapters(bookId, bibleId)
    const currentChapterNumber = getChapterNumberFromChapterId(currentChapterId)
    const currentIndex = chapters.findIndex((chapter) => chapter.number === currentChapterNumber)

    if (currentIndex < chapters.length - 1) {
      // Next chapter in the same book
      return chapters[currentIndex + 1].id
    } else {
      // Need to go to the next book
      const books = await getBooks(bibleId)
      const currentBookIndex = books.findIndex((book) => book.id === bookId)

      if (currentBookIndex < books.length - 1) {
        const nextBook = books[currentBookIndex + 1]
        const nextBookChapters = await getChapters(nextBook.id, bibleId)
        if (nextBookChapters.length > 0) {
          return nextBookChapters[0].id
        }
      }
    }

    return null
  } catch (error) {
    console.error("Error getting next chapter:", error)
    return null
  }
}

// Get previous chapter ID
export async function getPreviousChapterId(
  currentChapterId: string,
  bibleId: string = DEFAULT_BIBLE_ID,
): Promise<string | null> {
  try {
    const bookId = getBookNameFromChapterId(currentChapterId)
    const chapters = await getChapters(bookId, bibleId)
    const currentChapterNumber = getChapterNumberFromChapterId(currentChapterId)
    const currentIndex = chapters.findIndex((chapter) => chapter.number === currentChapterNumber)

    if (currentIndex > 0) {
      // Previous chapter in the same book
      return chapters[currentIndex - 1].id
    } else {
      // Need to go to the previous book
      const books = await getBooks(bibleId)
      const currentBookIndex = books.findIndex((book) => book.id === bookId)

      if (currentBookIndex > 0) {
        const prevBook = books[currentBookIndex - 1]
        const prevBookChapters = await getChapters(prevBook.id, bibleId)
        if (prevBookChapters.length > 0) {
          return prevBookChapters[prevBookChapters.length - 1].id
        }
      }
    }

    return null
  } catch (error) {
    console.error("Error getting previous chapter:", error)
    return null
  }
}

