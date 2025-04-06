
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Loader, Search } from 'lucide-react';
import { searchModels } from '../services/huggingFaceService';
import { HuggingFaceModel } from '../types';

interface ModelSelectionProps {
  apiKey: string;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export default function ModelSelection({ apiKey, selectedModel, onModelChange }: ModelSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [models, setModels] = useState<HuggingFaceModel[]>([]);
  const [error, setError] = useState<string | null>(null);

  const defaultModels = [
    { id: 'runwayml/stable-diffusion-v1-5', name: 'Stable Diffusion v1.5' },
    { id: 'stabilityai/stable-diffusion-2', name: 'Stable Diffusion v2' },
    { id: 'stabilityai/stable-diffusion-xl-base-1.0', name: 'Stable Diffusion XL' },
    { id: 'CompVis/stable-diffusion-v1-4', name: 'Stable Diffusion v1.4' },
    { id: 'prompthero/openjourney', name: 'Openjourney' },
  ];

  useEffect(() => {
    if (defaultModels.length > 0 && !selectedModel) {
      onModelChange(defaultModels[0].id);
    }
  }, [defaultModels, onModelChange, selectedModel]);

  const handleSearch = async () => {
    if (!apiKey || !searchQuery) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      const results = await searchModels(searchQuery, apiKey);
      setModels(results);
    } catch (error) {
      console.error('Error searching models:', error);
      setError('Failed to search models. Please check your API key and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4 glass-morphism p-4 rounded-lg">
      <div>
        <Label htmlFor="model" className="text-sm font-medium">
          Model
        </Label>
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="mt-1 input-glass">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <div className="py-2 px-3 border-b">
              <Label className="text-xs font-medium">Popular Models</Label>
            </div>
            {defaultModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name || model.id}
              </SelectItem>
            ))}
            
            {models.length > 0 && (
              <>
                <div className="py-2 px-3 border-b border-t">
                  <Label className="text-xs font-medium">Search Results</Label>
                </div>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.id}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="searchModel" className="text-sm font-medium">
          Search for models
        </Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="searchModel"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for Hugging Face models..."
            className="input-glass"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            onClick={handleSearch} 
            disabled={!apiKey || !searchQuery || isSearching}
            className="shrink-0"
          >
            {isSearching ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
        
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        
        <p className="text-xs text-muted-foreground mt-2">
          Search for text-to-image models on Hugging Face
        </p>
      </div>
    </div>
  );
}
