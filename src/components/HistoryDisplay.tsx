
import { useState } from 'react';
import { Button } from './ui/button';
import { Trash, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { downloadImage, clearGeneratedImages } from '../utils/storage';
import { GeneratedImage } from '../types';
import { Card, CardContent, CardFooter } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface HistoryDisplayProps {
  images: GeneratedImage[];
  onHistoryUpdated: () => void;
}

export default function HistoryDisplay({
  images,
  onHistoryUpdated,
}: HistoryDisplayProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 4;
  const totalPages = Math.ceil(images.length / imagesPerPage);
  
  const getCurrentImages = () => {
    const start = (currentPage - 1) * imagesPerPage;
    return images.slice(start, start + imagesPerPage);
  };
  
  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your generation history? This cannot be undone.')) {
      clearGeneratedImages();
      onHistoryUpdated();
    }
  };
  
  const handleDownload = (image: GeneratedImage) => {
    const filename = `generated-image-${image.timestamp}.png`;
    downloadImage(image.url, filename);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="glass-morphism p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">History</h3>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleClearHistory}
          disabled={images.length === 0}
        >
          <Trash className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>
      
      {images.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No images generated yet. Your history will appear here.
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getCurrentImages().map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <CardContent className="p-0 relative">
                  <img 
                    src={image.url} 
                    alt={image.prompt} 
                    className="w-full h-40 object-cover"
                  />
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2 p-3">
                  <p className="text-xs truncate w-full" title={image.prompt}>
                    {image.prompt}
                  </p>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(image.timestamp)}
                    </span>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleDownload(image)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
