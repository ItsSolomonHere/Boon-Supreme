import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

export function Drawer({
  open,
  onOpenChange,
  children,
  title,
  side = "right",
  className,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onOpenChange?.(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-brand-green-deep/40 backdrop-blur-[2px] transition-opacity"
        aria-label="Close panel"
        onClick={() => onOpenChange?.(false)}
      />
      <aside
        className={cn(
          "absolute flex w-[min(100vw,24rem)] flex-col border-l border-brand-green/10 bg-brand-cream shadow-warm transition-transform duration-300 ease-out",
          side === "right" ? "right-0" : "left-0",
          "top-0 h-full",
          className
        )}
        data-state="open"
      >
        <div className="flex items-center justify-between border-b border-brand-green/10 p-4">
          {title ? (
            <h2 className="font-display text-lg font-semibold text-brand-green-deep">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => onOpenChange?.(false)}
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </aside>
    </div>,
    document.body
  );
}
