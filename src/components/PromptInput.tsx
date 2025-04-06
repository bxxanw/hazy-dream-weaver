
import { useState } from 'react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  negativePrompt: string;
  onNegativePromptChange: (value: string) => void;
  showNegativePrompt: boolean;
  onShowNegativePromptChange: (value: boolean) => void;
}

export default function PromptInput({
  prompt,
  onPromptChange,
  negativePrompt,
  onNegativePromptChange,
  showNegativePrompt,
  onShowNegativePromptChange,
}: PromptInputProps) {
  
  return (
    <div className="space-y-4 glass-morphism p-4 rounded-lg">
      <div>
        <Label htmlFor="prompt" className="text-sm font-medium">
          Prompt
        </Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="mt-1 input-glass"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          checked={showNegativePrompt}
          onCheckedChange={onShowNegativePromptChange}
          id="negative-prompt-toggle"
        />
        <Label htmlFor="negative-prompt-toggle" className="text-sm font-medium">
          Use negative prompt
        </Label>
      </div>
      
      {showNegativePrompt && (
        <div>
          <Label htmlFor="negativePrompt" className="text-sm font-medium">
            Negative Prompt
          </Label>
          <Textarea
            id="negativePrompt"
            value={negativePrompt}
            onChange={(e) => onNegativePromptChange(e.target.value)}
            placeholder="Elements you want to exclude from the image..."
            className="mt-1 input-glass"
          />
        </div>
      )}
    </div>
  );
}
