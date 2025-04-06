
// Storage utility functions for both web and mobile

const isWeb = typeof window !== 'undefined';

// API Key storage
export const saveApiKey = async (apiKey: string): Promise<void> => {
  if (isWeb) {
    localStorage.setItem('huggingface_api_key', apiKey);
  } else {
    try {
      // For React Native, we'd need AsyncStorage
      // This is a placeholder - in a real project, we'd use AsyncStorage
      console.log('Saving API key to AsyncStorage');
    } catch (error) {
      console.error('Error saving API key:', error);
    }
  }
};

export const getApiKey = (): string | null => {
  if (isWeb) {
    return localStorage.getItem('huggingface_api_key');
  } else {
    // AsyncStorage would be used here in React Native
    return null;
  }
};

// Generated images history
export const saveGeneratedImage = (image: any): void => {
  if (isWeb) {
    const history = getGeneratedImages();
    history.unshift(image);
    localStorage.setItem('generated_images', JSON.stringify(history));
  } else {
    // AsyncStorage would be used here in React Native
  }
};

export const getGeneratedImages = (): any[] => {
  if (isWeb) {
    const history = localStorage.getItem('generated_images');
    return history ? JSON.parse(history) : [];
  } else {
    // AsyncStorage would be used here in React Native
    return [];
  }
};

export const clearGeneratedImages = (): void => {
  if (isWeb) {
    localStorage.removeItem('generated_images');
  } else {
    // AsyncStorage would be used here in React Native
  }
};

export const downloadImage = (url: string, filename: string) => {
  if (isWeb) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'generated-image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    // React Native file system operations would go here
    console.log('Downloading image on mobile...');
  }
};
