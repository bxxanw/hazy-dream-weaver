
export interface GenerationOptions {
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  numInferenceSteps: number;
  guidanceScale: number;
  seed?: number;
  modelId: string;
}

export interface ImageSize {
  name: string;
  width: number;
  height: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  numInferenceSteps: number;
  guidanceScale: number;
  seed?: number;
  modelId: string;
  timestamp: number;
}

export interface HuggingFaceModel {
  id: string;
  name?: string;
  likes?: number;
  downloads?: number;
}
