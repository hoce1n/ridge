import { useState, type ImgHTMLAttributes } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ImageZoom({
  src,
  alt = "",
  className,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [open, setOpen] = useState(false);
  if (!src) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="my-5 block w-full cursor-zoom-in border-0 bg-transparent p-0"
      >
        <img
          src={src}
          alt={alt}
          className={cn("w-full", className)}
          {...props}
        />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="top-[50%] w-[min(100%-1.5rem,64rem)] -translate-y-1/2 bg-background p-3"
          showClose
        >
          <DialogTitle className="sr-only">{alt || "Image"}</DialogTitle>
          <img src={src} alt={alt} className="w-full rounded-[var(--radius-md)]" />
        </DialogContent>
      </Dialog>
    </>
  );
}
