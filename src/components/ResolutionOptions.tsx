
import { useState } from 'react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { ImageSize } from '../types';

interface ResolutionOptionsProps {
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
}

export default function ResolutionOptions({
  width,
  height,
  onWidthChange,
  onHeightChange,
}: ResolutionOptionsProps) {
  const [customSize, setCustomSize] = useState(false);
  
  const predefinedSizes: ImageSize[] = [
    { name: 'Square (768×768)', width: 768, height: 768 },
    { name: 'Portrait (512×768)', width: 512, height: 768 },
    { name: 'Landscape (768×512)', width: 768, height: 512 },
    { name: 'Small Square (512×512)', width: 512, height: 512 },
    { name: 'Custom Size', width: 0, height: 0 },
  ];
  
  const handleSizeChange = (value: string) => {
    const size = predefinedSizes.find(s => s.name === value);
    
    if (size) {
      if (size.name === 'Custom Size') {
        setCustomSize(true);
      } else {
        setCustomSize(false);
        onWidthChange(size.width);
        onHeightChange(size.height);
      }
    }
  };
  
  // Find current size
  const getCurrentSize = () => {
    const size = predefinedSizes.find(s => s.width === width && s.height === height);
    return size ? size.name : 'Custom Size';
  };
  
  return (
    <div className="space-y-4 glass-morphism p-4 rounded-lg">
      <div>
        <Label htmlFor="size" className="text-sm font-medium">
          Image Size
        </Label>
        <Select 
          value={getCurrentSize()} 
          onValueChange={handleSizeChange}
        >
          <SelectTrigger className="mt-1 input-glass">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {predefinedSizes.map((size) => (
              <SelectItem key={size.name} value={size.name}>
                {size.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {(customSize || getCurrentSize() === 'Custom Size') && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="width" className="text-sm font-medium">
              Width
            </Label>
            <Input
              id="width"
              type="number"
              value={width}
              onChange={(e) => onWidthChange(Number(e.target.value))}
              placeholder="Width"
              className="mt-1 input-glass"
              min={64}
              max={1024}
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-sm font-medium">
              Height
            </Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => onHeightChange(Number(e.target.value))}
              placeholder="Height"
              className="mt-1 input-glass"
              min={64}
              max={1024}
            />
          </div>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Some models have specific size requirements. Recommended sizes are multiples of 64.
      </p>
    </div>
  );
}
