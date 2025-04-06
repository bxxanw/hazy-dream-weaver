
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Slider } from './ui/slider';

interface GenerationOptionsProps {
  numInferenceSteps: number;
  onNumInferenceStepsChange: (value: number) => void;
  guidanceScale: number;
  onGuidanceScaleChange: (value: number) => void;
  seed: number | undefined;
  onSeedChange: (value: number | undefined) => void;
  useSeed: boolean;
  onUseSeedChange: (value: boolean) => void;
}

export default function GenerationOptions({
  numInferenceSteps,
  onNumInferenceStepsChange,
  guidanceScale,
  onGuidanceScaleChange,
  seed,
  onSeedChange,
  useSeed,
  onUseSeedChange,
}: GenerationOptionsProps) {
  
  return (
    <div className="space-y-4 glass-morphism p-4 rounded-lg">
      <div>
        <div className="flex justify-between items-center">
          <Label htmlFor="steps" className="text-sm font-medium">
            Inference Steps: {numInferenceSteps}
          </Label>
          <span className="text-xs text-muted-foreground">
            (Higher = Better Quality, Slower)
          </span>
        </div>
        <Slider
          id="steps"
          min={10}
          max={150}
          step={1}
          value={[numInferenceSteps]}
          onValueChange={(value) => onNumInferenceStepsChange(value[0])}
          className="mt-2"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center">
          <Label htmlFor="guidance" className="text-sm font-medium">
            Guidance Scale: {guidanceScale.toFixed(1)}
          </Label>
          <span className="text-xs text-muted-foreground">
            (Higher = Follow Prompt More Closely)
          </span>
        </div>
        <Slider
          id="guidance"
          min={1}
          max={20}
          step={0.1}
          value={[guidanceScale]}
          onValueChange={(value) => onGuidanceScaleChange(value[0])}
          className="mt-2"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="use-seed"
          checked={useSeed}
          onChange={(e) => onUseSeedChange(e.target.checked)}
          className="rounded text-primary focus:ring-primary"
        />
        <Label htmlFor="use-seed" className="text-sm font-medium">
          Use seed for reproducibility
        </Label>
      </div>
      
      {useSeed && (
        <div>
          <Label htmlFor="seed" className="text-sm font-medium">
            Seed
          </Label>
          <Input
            id="seed"
            type="number"
            value={seed !== undefined ? seed : ''}
            onChange={(e) => {
              const value = e.target.value;
              onSeedChange(value === '' ? undefined : Number(value));
            }}
            placeholder="Enter seed (optional)"
            className="mt-1 input-glass"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Using the same seed with identical settings will produce similar results
          </p>
        </div>
      )}
    </div>
  );
}
