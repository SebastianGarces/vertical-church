/**
 * Converts a single Bible verse reference to a Biblia.com URL.
 *
 * Format: https://biblia.com/books/csb/{Book}{Chapter}.{Verse}
 * - Book name spelled out (no spaces between book name parts)
 * - Chapter number directly after book
 * - Period separating chapter and verse
 * - For ranges, only the first verse is used
 *
 * Examples:
 * - "John 1:14" → "John1.14"
 * - "1 Timothy 3:16" → "1Timothy3.16"
 * - "Romans 3:10-19" → "Romans3.10"
 */
function verseToUrl(reference: string): string {
  // Match pattern: optional number prefix, book name(s), chapter:verse (possibly with range)
  // Examples: "John 1:14", "1 Timothy 3:16", "Romans 3:10-19", "2 Corinthians 1:21-22"
  const match = reference
    .trim()
    .match(/^(\d?\s*[A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(\d+):(\d+)(?:-\d+)?$/);

  if (!match) {
    // Fallback: just return a search URL
    return `https://biblia.com/bible/csb/${encodeURIComponent(reference)}`;
  }

  const [, book, chapter, verse] = match;
  // Remove spaces from book name (e.g., "1 Timothy" → "1Timothy", "Song of Solomon" → "SongofSolomon")
  const cleanBook = book.replace(/\s+/g, "");

  return `https://biblia.com/books/csb/${cleanBook}${chapter}.${verse}`;
}

interface BibleVerseProps {
  reference: string;
  children?: React.ReactNode;
}

export function BibleVerse({ reference, children }: BibleVerseProps) {
  const url = verseToUrl(reference);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="underline"
    >
      {children || reference}
    </a>
  );
}

/**
 * Parses a complex verse reference string and returns individual references with their context.
 *
 * Handles formats like:
 * - "John 1:1, 1:14, 1:18" → ["John 1:1", "John 1:14", "John 1:18"]
 * - "John 1:1; Romans 3:10" → ["John 1:1", "Romans 3:10"]
 * - "1 Corinthians 12:4-5, 12:11-13" → ["1 Corinthians 12:4-5", "1 Corinthians 12:11-13"]
 */
interface ParsedVerse {
  reference: string;
  displayText: string;
  separator: string;
}

function parseVerseReferences(text: string): ParsedVerse[] {
  const results: ParsedVerse[] = [];
  let currentBook = "";

  // Split by semicolons first (major separator between different book references)
  const semicolonParts = text.split(";");

  semicolonParts.forEach((part, partIndex) => {
    const trimmedPart = part.trim();
    if (!trimmedPart) return;

    // Split by commas (can be same book different verses or just continuation)
    const commaParts = trimmedPart.split(",");

    commaParts.forEach((commaPart, commaIndex) => {
      const trimmed = commaPart.trim();
      if (!trimmed) return;

      // Check if this starts with a book name (including numbered books like "1 Timothy")
      const bookMatch = trimmed.match(
        /^(\d?\s*[A-Za-z]+(?:\s+[A-Za-z]+)?)\s+(\d+:\d+(?:-\d+)?)$/
      );

      let fullReference: string;
      let displayText: string;

      if (bookMatch) {
        // This is a full reference with book name
        currentBook = bookMatch[1];
        fullReference = trimmed;
        displayText = trimmed;
      } else {
        // This might just be a chapter:verse reference, use the current book
        const chapterVerseMatch = trimmed.match(/^(\d+:\d+(?:-\d+)?)$/);
        if (chapterVerseMatch && currentBook) {
          fullReference = `${currentBook} ${trimmed}`;
          displayText = trimmed;
        } else {
          // Can't parse, just use as-is
          fullReference = trimmed;
          displayText = trimmed;
        }
      }

      // Determine separator for display
      let separator = "";
      if (commaIndex < commaParts.length - 1) {
        separator = ", ";
      } else if (partIndex < semicolonParts.length - 1) {
        separator = "; ";
      }

      results.push({
        reference: fullReference,
        displayText: displayText,
        separator: separator,
      });
    });
  });

  return results;
}

interface VersesProps {
  refs: string;
}

/**
 * Component to render a complex string of Bible verse references.
 * Each reference becomes a clickable link to Biblia.com.
 *
 * Usage: <Verses refs="John 1:1, 1:14; Romans 3:10-19" />
 */
export function Verses({ refs }: VersesProps) {
  const parsedVerses = parseVerseReferences(refs);

  return (
    <span>
      (
      {parsedVerses.map((verse, index) => (
        <span key={index}>
          <a
            href={verseToUrl(verse.reference)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {verse.displayText}
          </a>
          {verse.separator}
        </span>
      ))}
      )
    </span>
  );
}
