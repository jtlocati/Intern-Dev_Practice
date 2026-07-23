"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg",
          className
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            &times;
          </span>
        </button>

        {title && (
          <h2 className="mb-4 pr-6 text-lg font-semibold text-gray-900">{title}</h2>
        )}

        {children}
      </div>
    </div>
  );
}

export default Modal;
