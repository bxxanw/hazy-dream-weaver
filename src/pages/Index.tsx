
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ApiKeyInput from '../components/ApiKeyInput';
import PromptInput from '../components/PromptInput';
import ModelSelection from '../components/ModelSelection';
import ResolutionOptions from '../components/ResolutionOptions';
import GenerationOptions from '../components/GenerationOptions';
import ImageDisplay from '../components/ImageDisplay';
import HistoryDisplay from '../components/HistoryDisplay';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from '../components/ui/use-toast';
import { generateImage } from '../services/huggingFaceService';
import { getGeneratedImages, saveGeneratedImage } from '../utils/storage';
import { GeneratedImage, GenerationOptions as Options } from '../types';
import { Wand2 } from 'lucide-react';

export default function Index() {
  const [apiKey, setApiKey] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [showNegativePrompt, setShowNegativePrompt] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(512);
  const [height, setHeight] = useState<number>(512);
  const [numInferenceSteps, setNumInferenceSteps] = useState<number>(50);
  const [guidanceScale, setGuidanceScale] = useState<number>(7.5);
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [useSeed, setUseSeed] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('runwayml/stable-diffusion-v1-5');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [activeTab, setActiveTab] = useState<string>('generate');
  
  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);
  
  const loadHistory = () => {
    const savedHistory = getGeneratedImages();
    setHistory(savedHistory);
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Hugging Face API key",
        variant: "destructive",
      });
      return;
    }

    if (!prompt) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt for your image",
        variant: "destructive",
      });
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const options: Options = {
        prompt,
        negativePrompt: showNegativePrompt ? negativePrompt : '',
        width,
        height,
        numInferenceSteps,
        guidanceScale,
        seed: useSeed ? seed : undefined,
        modelId: selectedModel,
      };

      const imageUrl = await generateImage(options, apiKey);
      
      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
        
        // Save to history
        const generatedImage: GeneratedImage = {
          id: uuidv4(),
          url: imageUrl,
          prompt,
          negativePrompt: showNegativePrompt ? negativePrompt : '',
          width,
          height,
          numInferenceSteps,
          guidanceScale,
          seed: useSeed ? seed : undefined,
          modelId: selectedModel,
          timestamp: Date.now(),
        };
        
        saveGeneratedImage(generatedImage);
        loadHistory();
        
        toast({
          title: "Image generated!",
          description: "Your image has been successfully created.",
        });
      }
    } catch (err: any) {
      console.error('Error generating image:', err);
      setError(err.message || 'Failed to generate image');
      
      toast({
        title: "Generation Failed",
        description: err.message || 'Failed to generate image',
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
            HuggingFace Image Generator
          </span>
        </h1>
        <p className="text-muted-foreground">
          Create beautiful images with AI using the Hugging Face API
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ApiKeyInput onApiKeyChange={setApiKey} />
          
          <Tabs defaultValue="options" className="w-full">
            <TabsList className="grid grid-cols-2 mb-2">
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
            </TabsList>
            
            <TabsContent value="options" className="space-y-6">
              <ResolutionOptions
                width={width}
                height={height}
                onWidthChange={setWidth}
                onHeightChange={setHeight}
              />
              
              <GenerationOptions
                numInferenceSteps={numInferenceSteps}
                onNumInferenceStepsChange={setNumInferenceSteps}
                guidanceScale={guidanceScale}
                onGuidanceScaleChange={setGuidanceScale}
                seed={seed}
                onSeedChange={setSeed}
                useSeed={useSeed}
                onUseSeedChange={setUseSeed}
              />
            </TabsContent>
            
            <TabsContent value="models">
              <ModelSelection
                apiKey={apiKey}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-2">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="animate-fade-in">
              <div className="space-y-6">
                <PromptInput
                  prompt={prompt}
                  onPromptChange={setPrompt}
                  negativePrompt={negativePrompt}
                  onNegativePromptChange={setNegativePrompt}
                  showNegativePrompt={showNegativePrompt}
                  onShowNegativePromptChange={setShowNegativePrompt}
                />
                
                <Button 
                  onClick={handleGenerate} 
                  className="w-full"
                  size="lg"
                  disabled={!apiKey || !prompt || isGenerating}
                >
                  {isGenerating ? 'Generating...' : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Image
                    </>
                  )}
                </Button>
                
                <ImageDisplay
                  imageUrl={generatedImageUrl}
                  isLoading={isGenerating}
                  error={error}
                  prompt={prompt}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="animate-fade-in">
              <HistoryDisplay 
                images={history} 
                onHistoryUpdated={loadHistory}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
