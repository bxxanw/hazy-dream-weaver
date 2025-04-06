
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { getApiKey, saveApiKey } from '../utils/storage';
import { Loader, Check, X } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

export default function ApiKeyInput({ onApiKeyChange }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const storedKey = getApiKey();
    if (storedKey) {
      setApiKey(storedKey);
      onApiKeyChange(storedKey);
    }
  }, [onApiKeyChange]);

  const handleSaveApiKey = async () => {
    if (!apiKey) return;
    
    setIsSaving(true);
    try {
      await saveApiKey(apiKey);
      onApiKeyChange(apiKey);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(null), 2000);
    } catch (error) {
      setSavedSuccess(false);
      setTimeout(() => setSavedSuccess(null), 2000);
      console.error('Error saving API key:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mb-6 glass-morphism p-4 rounded-lg">
      <div className="flex flex-col gap-2">
        <Label htmlFor="apiKey" className="text-sm font-medium">
          Hugging Face API Key
        </Label>
        <div className="flex gap-2">
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Hugging Face API key"
            className="input-glass"
          />
          <Button 
            onClick={handleSaveApiKey} 
            disabled={!apiKey || isSaving}
            className="shrink-0"
          >
            {isSaving ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : savedSuccess === true ? (
              <Check className="h-4 w-4" />
            ) : savedSuccess === false ? (
              <X className="h-4 w-4" />
            ) : (
              'Save Key'
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Your API key is stored locally and never sent to our servers.
        </p>
      </div>
    </div>
  );
}
