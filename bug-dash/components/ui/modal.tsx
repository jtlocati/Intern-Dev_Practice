"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface ModalProps {
   open: boolean;
   onClose: () => void;
   title?: string;
   description?: string;
   children?: React.ReactNode;
   /** footer actions, e.g. Cancel / Confirm buttons */
   footer?: React.ReactNode;
   className?: string;
}

export function Modal({ open, onClose, title, description, children, footer, className }: ModalProps) {
   const panelRef = useRef<HTMLDivElement>(null);

   // Close on Escape + lock body scroll while open.
   useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
         if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // move focus into the dialog
      panelRef.current?.focus();
      return () => {
         document.removeEventListener("keydown", onKey);
         document.body.style.overflow = prev;
      };
   }, [open, onClose]);

   if (!open || typeof document === "undefined") return null;

   return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-hidden={false}>
         {/* backdrop */}
         <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] animate-in fade-in" onClick={onClose} />
         {/* panel */}
         <div ref={panelRef} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} className={cn("relative z-10 w-full max-w-lg rounded-[var(--radius)] outline-none", "border border-[var(--border)] bg-[var(--surface)] shadow-xl", className)}>
            {(title || description) && (
               <div className="border-b border-[var(--border)] px-5 py-4">
                  {title && <h2 className="text-base font-semibold text-[var(--fg)]">{title}</h2>}
                  {description && <p className="mt-1 text-sm text-[var(--fg-muted)]">{description}</p>}
               </div>
            )}

            {children && <div className="px-5 py-4">{children}</div>}

            {footer && <div className="flex justify-end gap-2 border-t border-[var(--border)] px-5 py-3">{footer}</div>}

            <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md text-[var(--fg-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]">
               <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
               </svg>
            </button>
         </div>
      </div>,
      document.body,
   );
}
