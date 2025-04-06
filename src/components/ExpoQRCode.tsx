
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { QrCode } from 'lucide-react';

export default function ExpoQRCode() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Generate a proper formatted Expo URL for the QR code
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const port = typeof window !== 'undefined' ? window.location.port : '';
  
  // Format the URL without hyphens, using the correct Expo URL format
  // exp://192.168.1.2:8080 or exp://hostname:port
  const expoUrl = `exp://${hostname}:${port}`;
  
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
          <DialogDescription>
            Scan the QR code below with your Expo Go app
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6">
          <div className="bg-white p-4 rounded-md">
            <QRCodeSVG value={expoUrl} size={200} />
          </div>
          <p className="text-sm text-center mt-4 text-muted-foreground">
            URL: {expoUrl}
          </p>
          <div className="mt-4 text-center">
            <p className="text-sm font-medium">Steps to use with Expo Go:</p>
            <ol className="text-sm text-muted-foreground text-left list-decimal pl-5 mt-1 space-y-1">
              <li>Install Expo Go app on your device</li>
              <li>Make sure your device is connected to the same network as your computer</li>
              <li>Scan this QR code with the Expo Go app</li>
              <li>For direct entry: Open Expo Go and enter the URL manually</li>
              <li>If you have issues connecting, check that your computer and device are on the same network</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
