"use client";

import { createContext, useContext, useState } from "react";
import { MotionConfig } from "motion/react";
import { XIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlanVisitForm } from "@/app/visit/components";

/**
 * One shared Plan a Visit dialog for every PLAN YOUR VISIT button on /christmas.
 * It holds the same PlanVisitForm component as /visit (same server action, validation,
 * spam handling and GA4 event). Radix Dialog provides the focus trap, Esc to close,
 * scroll lock and focus return to the button that opened it.
 *
 * MotionConfig here also makes every Motion animation on the page honor
 * prefers-reduced-motion (transform animations are skipped, opacity still fades).
 */

const PlanVisitDialogContext = createContext<(() => void) | null>(null);

export function PlanVisitDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <PlanVisitDialogContext.Provider value={() => setOpen(true)}>
        {children}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            showCloseButton={false}
            className="block gap-0 overflow-y-auto overscroll-contain border-0 bg-navy p-0 text-pipper shadow-2xl max-sm:inset-0 max-sm:h-[100dvh] max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none sm:max-h-[min(52rem,calc(100dvh-3rem))] sm:max-w-2xl sm:rounded-[20px] sm:border-2 sm:border-pipper/20"
          >
            <DialogTitle className="sr-only">Plan your Christmas Eve visit</DialogTitle>
            <DialogDescription className="sr-only">
              Let us know you&apos;re coming to Christmas Eve at Vertical Church. Three short steps.
            </DialogDescription>
            <DialogClose
              className="absolute right-3 top-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-pipper transition-colors hover:bg-pipper/10 focus-visible:outline-2 focus-visible:outline-pipper"
              aria-label="Close"
            >
              <XIcon className="size-6" aria-hidden="true" />
            </DialogClose>
            <PlanVisitForm className="pt-14 pb-10 sm:pt-12" thankYouNote="See you Christmas Eve!" />
          </DialogContent>
        </Dialog>
      </PlanVisitDialogContext.Provider>
    </MotionConfig>
  );
}

export function PlanVisitButton({ className = "", children = "Plan your visit" }: { className?: string; children?: React.ReactNode }) {
  const openDialog = useContext(PlanVisitDialogContext);

  return (
    <button
      type="button"
      onClick={() => openDialog?.()}
      aria-haspopup="dialog"
      className={`inline-flex cursor-pointer items-center justify-center bg-florence px-8 py-3 font-button text-sm font-bold uppercase tracking-[0.25em] text-pipper transition-colors hover:bg-florence/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pipper ${className}`}
    >
      {children}
    </button>
  );
}
