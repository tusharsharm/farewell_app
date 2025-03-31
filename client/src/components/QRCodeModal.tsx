import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCode } from "./ui/qr-code";
import { Download, Send, X } from "lucide-react";
import { Person } from "@shared/schema";

interface QRCodeModalProps {
  person: Person;
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeModal({ person, isOpen, onClose }: QRCodeModalProps) {
  const qrCodeUrl = `${window.location.origin}/person/${person.id}`;

  const handleDownload = () => {
    const canvas = document.querySelector<HTMLCanvasElement>("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `qrcode-${person.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = url;
    link.click();
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Farewell QR Code for ${person.name}`);
    const body = encodeURIComponent(
      `Here is the QR code link for ${person.name}'s farewell page: ${qrCodeUrl}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for {person.name}</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Scan this QR code to open {person.name}'s farewell page:
          </p>
          <div className="flex justify-center">
            <QRCode
              value={qrCodeUrl}
              size={200}
              level="H"
              className="mx-auto"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500 break-all">
            {qrCodeUrl}
          </p>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            onClick={handleSendEmail}
          >
            <Send className="mr-2 h-4 w-4" />
            Send via Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
