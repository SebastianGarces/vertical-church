'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EventWithDetails } from '@/lib/planning-center';
import { Calendar, ChevronDown, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';

interface EventCardProps {
  event: EventWithDetails;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function stripHtml(html: string): string {
  // Simple HTML strip - remove tags but keep text
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function LinkifiedText({ text }: { text: string }) {
  // Regex to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, index) => {
        if (urlRegex.test(part)) {
          // Reset regex lastIndex since we're reusing it
          urlRegex.lastIndex = 0;
          return (
            <a
              key={index}
              href={part}
              target='_blank'
              rel='noopener noreferrer'
              className='break-all text-florence underline underline-offset-2 hover:text-florence/80'
            >
              {part}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function getGoogleMapsUrl(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function EventCard({ event }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasImage = !!event.logoUrl;
  const hasDescription = !!event.description;
  const canExpand = hasImage || hasDescription;

  // Get the next upcoming time, or use openAt
  const nextTime = event.times[0];
  const displayDate = nextTime?.startsAt ?? event.openAt;

  return (
    <Card className='border-salte/30 bg-navy/50 py-4'>
      <CardHeader className='py-0'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex-1'>
            <CardTitle className='font-heading text-xl font-bold text-pipper md:text-2xl'>{event.name}</CardTitle>

            <div className='mt-2 flex flex-col gap-1 md:flex-row md:flex-wrap md:items-center md:gap-x-4'>
              {/* Date/Time */}
              {displayDate && (
                <div className='flex items-center gap-2 text-base text-pipper/70'>
                  <Calendar className='h-4 w-4 shrink-0 text-yuma' />
                  <span>
                    {formatDate(displayDate)}
                    {nextTime && ` at ${formatTime(nextTime.startsAt)}`}
                  </span>
                  {event.times.length > 1 && (
                    <span className='text-sm text-florence'>+{event.times.length - 1} more</span>
                  )}
                </div>
              )}

              {/* Location */}
              {event.location && (
                <a
                  href={getGoogleMapsUrl(event.location.address)}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-base text-pipper/70 transition-colors hover:text-florence'
                >
                  <MapPin className='h-4 w-4 shrink-0 text-yuma' />
                  <span className='underline underline-offset-2'>{event.location.name}</span>
                </a>
              )}
            </div>
          </div>

          {/* Desktop: Register button + expand icon */}
          <div className='hidden items-center gap-2 md:flex'>
            <a
              href={event.registrationUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center justify-center border-2 border-florence bg-florence px-4 py-2 font-button text-sm font-bold uppercase tracking-[0.2em] text-pipper transition-all duration-200 hover:bg-florence/90'
            >
              Register
            </a>
            <div className='w-9'>
              {canExpand && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className='rounded-full p-2 text-pipper/50 transition-colors hover:bg-salte/20 hover:text-pipper'
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                >
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* Mobile: Only expand icon in top right */}
          <div className='w-9 md:hidden'>
            {canExpand && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className='rounded-full p-2 text-pipper/50 transition-colors hover:bg-salte/20 hover:text-pipper'
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
              >
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && canExpand && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='overflow-hidden'
          >
            <CardContent className='pt-4'>
              {/* Event image */}
              {hasImage && (
                <div className='mb-4 overflow-hidden rounded-lg'>
                  <Image
                    src={event.logoUrl!}
                    alt={event.name}
                    width={1200}
                    height={800}
                    className='h-auto w-full object-cover'
                  />
                </div>
              )}

              {/* Description */}
              {hasDescription && (
                <p className='whitespace-pre-line break-words font-body text-base leading-relaxed text-pipper/80'>
                  <LinkifiedText text={stripHtml(event.description!)} />
                </p>
              )}

              {/* All event times */}
              {event.times.length > 1 && (
                <div className='mt-4'>
                  <h4 className='mb-1 text-sm font-semibold uppercase tracking-wider text-pipper/60'>All Dates</h4>
                  <ul className='space-y-0.5'>
                    {event.times.map((time, index) => (
                      <li key={index} className='flex items-center gap-2 text-base text-pipper/70'>
                        <Calendar className='h-4 w-4 text-yuma' />
                        <span>
                          {formatDate(time.startsAt)} at {formatTime(time.startsAt)}
                          {time.endsAt && ` - ${formatTime(time.endsAt)}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Location address */}
              {event.location?.address && (
                <div className='mt-10'>
                  <h4 className='mb-1 text-sm font-semibold uppercase tracking-wider text-pipper/60'>Location</h4>
                  <a
                    href={getGoogleMapsUrl(event.location.address)}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 text-base text-pipper/70 transition-colors hover:text-florence'
                  >
                    <MapPin className='h-4 w-4 text-yuma' />
                    <span className='underline underline-offset-2'>
                      {event.location.name} · {event.location.address.replace(/\n/g, ', ')}
                    </span>
                  </a>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile: Register button at bottom, full width */}
      <CardContent className='pt-4 md:hidden'>
        <a
          href={event.registrationUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex w-full items-center justify-center border-2 border-florence bg-florence px-4 py-2 font-button text-sm font-bold uppercase tracking-[0.2em] text-pipper transition-all duration-200 hover:bg-florence/90'
        >
          Register
        </a>
      </CardContent>
    </Card>
  );
}
