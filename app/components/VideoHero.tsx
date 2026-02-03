"use client";

import { motion } from "motion/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";

interface VideoHeroProps {
  /** Vimeo video ID */
  vimeoVideoId: string;
  /** Vimeo hash for private/unlisted videos */
  vimeoHash?: string;
  /** Title content - can include JSX for styling */
  title?: ReactNode;
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  if (muted) {
    // Speaker with X (muted)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    );
  }

  // Speaker with sound waves (unmuted)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function VideoSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-navy/50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-pipper/20 border-t-pipper" />
    </div>
  );
}

export function VideoHero({ vimeoVideoId, vimeoHash, title }: VideoHeroProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Build Vimeo embed URL with background mode (no controls)
  // dnt=1 enables "Do Not Track" - disables cookies and analytics
  const hashParam = vimeoHash ? `&h=${vimeoHash}` : "";
  const vimeoSrc = `https://player.vimeo.com/video/${vimeoVideoId}?background=1&autoplay=1&loop=1&muted=1&playsinline=1&dnt=1${hashParam}`;

  useEffect(() => {
    if (iframeRef.current && !playerRef.current) {
      const player = new Player(iframeRef.current);
      playerRef.current = player;

      // Listen for the video to be loaded and playing
      player.on("playing", () => {
        setIsLoaded(true);
      });
    }

    return () => {
      playerRef.current = null;
    };
  }, []);

  const toggleMute = async () => {
    if (playerRef.current) {
      if (isMuted) {
        await playerRef.current.setVolume(1);
      } else {
        await playerRef.current.setVolume(0);
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative bg-navy pt-16 md:pt-20">
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-8 md:px-8 md:pt-16 md:pb-12 lg:pt-20 lg:pb-16">
        {/* Title - in normal document flow above video */}
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="font-heading text-4xl font-bold uppercase leading-[1.1] tracking-tight text-pipper md:text-5xl lg:text-6xl xl:text-7xl">
              {title}
            </h1>
          </motion.div>
        )}

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative overflow-hidden rounded-[20px]"
        >
          {/* Responsive container maintaining 16:9 aspect ratio */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              ref={iframeRef}
              src={vimeoSrc}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Video"
            />
            
            {/* Loading skeleton */}
            {!isLoaded && <VideoSkeleton />}
          </div>

          {/* Mute/Unmute Button - only show after loaded */}
          {isLoaded && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMute}
              className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-navy/70 text-pipper backdrop-blur-sm transition-colors hover:bg-navy/90 cursor-pointer"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              <SpeakerIcon muted={isMuted} />
            </motion.button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
