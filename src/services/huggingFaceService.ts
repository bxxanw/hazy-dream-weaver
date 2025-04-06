
import { GenerationOptions } from "../types";

const API_BASE_URL = "https://api-inference.huggingface.co/models";

// Create an AbortController for cancelling requests
let currentController: AbortController | null = null;

export const searchModels = async (query: string, apiKey: string): Promise<any[]> => {
  try {
    console.log("Searching models with query:", query);
    const response = await fetch(`https://huggingface.co/api/models?search=${query}&filter=image-to-image,text-to-image`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error searching models: ${response.status}`, errorText);
      throw new Error(`Error searching models: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Found ${data.length} models matching query`);
    
    return data.filter((model: any) => 
      (model.pipeline_tag === 'text-to-image' || model.pipeline_tag === 'image-to-image')
    ).slice(0, 20); // Limit to 20 results
  } catch (error) {
    console.error('Error searching models:', error);
    return [];
  }
};

export const cancelGeneration = () => {
  if (currentController) {
    console.log("Cancelling current image generation request");
    currentController.abort();
    currentController = null;
    return true;
  }
  return false;
};

export const generateImage = async (
  options: GenerationOptions, 
  apiKey: string, 
  onProgress?: (progress: number) => void
): Promise<string | null> => {
  try {
    // Create a new AbortController for this request
    currentController = new AbortController();
    const signal = currentController.signal;
    
    const { modelId, prompt, negativePrompt, width, height, numInferenceSteps, guidanceScale, seed } = options;
    
    console.log("Generating image with options:", {
      modelId,
      prompt,
      negativePrompt: negativePrompt ? "Present" : "None",
      width,
      height,
      numInferenceSteps,
      guidanceScale,
      seed: seed !== undefined && seed !== null ? Number(seed) : "undefined"
    });

    const payload = {
      inputs: prompt,
      parameters: {
        negative_prompt: negativePrompt || undefined,
        width,
        height,
        num_inference_steps: numInferenceSteps,
        guidance_scale: guidanceScale,
        seed: seed !== undefined && seed !== null ? Number(seed) : undefined
      }
    };

    console.log("Sending request to:", `${API_BASE_URL}/${modelId}`);
    
    const response = await fetch(`${API_BASE_URL}/${modelId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error generating image: ${response.status}`, errorText);
      throw new Error(`Error generating image: ${response.statusText} (${response.status})`);
    }

    // The response is the binary image data
    const reader = response.body?.getReader();
    const contentLength = response.headers.get('Content-Length') || '0';
    const totalLength = parseInt(contentLength, 10);
    
    // If we have a reader, use it to track progress
    if (reader && totalLength > 0 && onProgress) {
      let receivedLength = 0; 
      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        chunks.push(value);
        receivedLength += value.length;
        
        // Calculate progress percentage
        const progress = Math.min(100, Math.round((receivedLength / totalLength) * 100));
        onProgress(progress);
      }
      
      // Concatenate chunks into a single Uint8Array
      const chunksAll = new Uint8Array(receivedLength);
      let position = 0;
      for (const chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
      }
      
      const blob = new Blob([chunksAll], { type: response.headers.get('Content-Type') || 'image/jpeg' });
      console.log("Received blob:", blob.type, blob.size, "bytes");
      return URL.createObjectURL(blob);
    } else {
      // Fallback if reader is not available or content length is unknown
      const blob = await response.blob();
      console.log("Received blob:", blob.type, blob.size, "bytes");
      return URL.createObjectURL(blob);
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('Image generation was cancelled');
      return null;
    }
    
    console.error('Error generating image:', error);
    throw error;
  } finally {
    currentController = null;
  }
};
