import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  includeMargin?: boolean;
  bgColor?: string;
  fgColor?: string;
  level?: "L" | "M" | "Q" | "H";
}

export function QRCode({
  value,
  size = 200,
  className,
  includeMargin = true,
  bgColor = "#FFFFFF",
  fgColor = "#000000",
  level = "L",
}: QRCodeProps) {
  return (
    <div className={cn("rounded bg-white inline-flex p-2", className)}>
      <QRCodeSVG
        value={value}
        size={size}
        includeMargin={includeMargin}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level}
      />
    </div>
  );
}
