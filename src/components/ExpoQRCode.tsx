
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { QrCode } from 'lucide-react';

export default function ExpoQRCode() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the current URL to create QR code
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          <span>Open in Expo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Open in Expo Go App</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6">
          <div className="bg-white p-4 rounded-md">
            <QRCodeSVG value={currentUrl} size={200} />
          </div>
          <p className="text-sm text-center mt-4 text-muted-foreground">
            Scan this QR code with your Expo Go app to open this application on your mobile device.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
