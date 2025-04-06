
import { GenerationOptions } from "../types";

const API_BASE_URL = "https://api-inference.huggingface.co/models";

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

export const generateImage = async (options: GenerationOptions, apiKey: string): Promise<string | null> => {
  try {
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
      body: JSON.stringify(payload)
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error generating image: ${response.status}`, errorText);
      throw new Error(`Error generating image: ${response.statusText} (${response.status})`);
    }

    // The response is the binary image data
    const blob = await response.blob();
    console.log("Received blob:", blob.type, blob.size, "bytes");
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};
