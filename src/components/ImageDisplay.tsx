
import { useState } from 'react';
import { Button } from './ui/button';
import { Download, Loader, X } from 'lucide-react';
import { downloadImage } from '../utils/storage';
import { Progress } from './ui/progress';
import { cancelGeneration } from '../services/huggingFaceService';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  prompt: string;
  progress: number;
  onCancel: () => void;
}

export default function ImageDisplay({
  imageUrl,
  isLoading,
  error,
  prompt,
  progress,
  onCancel,
}: ImageDisplayProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleDownload = () => {
    if (imageUrl) {
      const filename = `generated-image-${Date.now()}.png`;
      downloadImage(imageUrl, filename);
    }
  };

  const handleCancel = () => {
    cancelGeneration();
    onCancel();
  };

  return (
    <div className="flex flex-col items-center justify-center glass-morphism rounded-lg overflow-hidden">
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8 min-h-[300px] w-full">
          <Loader className="h-12 w-12 animate-spin mb-4 text-primary" />
          <p className="text-center text-muted-foreground">Generating your image...</p>
          
          <div className="w-full max-w-md mt-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-center text-xs text-muted-foreground">{progress}% complete</p>
          </div>
          
          <Button 
            variant="destructive"
            size="sm"
            onClick={handleCancel}
            className="mt-4"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel Generation
          </Button>
        </div>
      )}
      
      {error && !isLoading && (
        <div className="p-8 min-h-[300px] flex flex-col items-center justify-center">
          <p className="text-red-500 mb-2">Error: {error}</p>
          <p className="text-center text-muted-foreground">Please check your API key and settings, then try again.</p>
        </div>
      )}
      
      {!isLoading && !error && !imageUrl && (
        <div className="p-8 min-h-[300px] flex flex-col items-center justify-center">
          <p className="text-center text-muted-foreground">Your generated image will appear here</p>
        </div>
      )}
      
      {imageUrl && !isLoading && (
        <div className="relative w-full">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          <img
            src={imageUrl}
            alt={prompt || "Generated image"}
            className={`w-full h-auto ${isImageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <Button
              onClick={handleDownload}
              variant="secondary"
              className="w-full"
              disabled={!imageUrl}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
