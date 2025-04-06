
import { GenerationOptions } from "../types";

const API_BASE_URL = "https://api-inference.huggingface.co/models";

export const searchModels = async (query: string, apiKey: string): Promise<any[]> => {
  try {
    const response = await fetch(`https://huggingface.co/api/models?search=${query}&filter=image-to-image,text-to-image`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
    });

    if (!response.ok) {
      throw new Error(`Error searching models: ${response.status}`);
    }

    const data = await response.json();
    
    return data.filter((model: any) => 
      (model.pipeline_tag === 'text-to-image' || model.pipeline_tag === 'image-to-image')
    ).slice(0, 20); // Limit to 20 results
  } catch (error) {
    console.error('Error searching models:', error);
    return [];
  }
};

export const generateImage = async (options: GenerationOptions, apiKey: string): Promise<string | null> => {
  try {
    const { modelId, prompt, negativePrompt, width, height, numInferenceSteps, guidanceScale, seed } = options;
    
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

    const response = await fetch(`${API_BASE_URL}/${modelId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error generating image: ${response.statusText}`);
    }

    // The response is the binary image data
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};
