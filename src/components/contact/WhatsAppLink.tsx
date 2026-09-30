"use client";

import { trackContact } from "@/lib/meta-pixel";

type WhatsAppLinkProps = {
  variant?: "floating" | "inline";
};

const whatsappUrl = "https://wa.me/8801988891097";

export default function WhatsAppLink({
  variant = "floating",
}: WhatsAppLinkProps) {
  const isFloating = variant === "floating";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp-এ যোগাযোগ করুন"
      title="WhatsApp-এ যোগাযোগ করুন"
      onClick={() => {
        trackContact({
          content_category: "contact",
          content_name: "whatsapp",
        });
      }}
      className={
        isFloating
          ? "fixed bottom-5 right-5 z-[60] flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-950/20 transition hover:scale-105 hover:bg-[#1FB85A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128C7E] sm:bottom-6 sm:right-6 sm:size-14"
          : "inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1FB85A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128C7E]"
      }
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className={isFloating ? "size-6" : "size-5"}
      >
        <path
          d="M20.2 11.8a8.2 8.2 0 0 1-12.1 7.1L3 20l1.2-4.9a8.2 8.2 0 1 1 16-3.3Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M8.5 8.2c.2-.4.4-.4.7-.4h.4c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.5.6c-.2.2-.2.4 0 .6.5.9 1.2 1.6 2.1 2.1.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.3.3.5 0 .4-.2 1-.7 1.3-.5.4-1.1.6-1.9.4-1.1-.3-2.4-1-3.5-2.1-1-1-1.7-2.2-2-3.2-.3-.9 0-1.7.5-2.3Z"
          fill="currentColor"
        />
      </svg>
      {!isFloating && <span>WhatsApp-এ যোগাযোগ করুন</span>}
    </a>
  );
}