import { Copy, Play } from "lucide-react";
import { useState } from "react";

import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "./ui/select";
import { DURATION_TOKEN } from "../lib/duration-tokens";
import type { Easing } from "../lib/css-easings";

interface Props {
  easing: Easing;
}

export const CSSEasing = ({ easing }: Props) => {
  const [selectedDuration, setSelectedDuration] =
    useState<string>("duration-300");
  const [isAnimating, setIsAnimating] = useState(false);

  const durationMs =
    DURATION_TOKEN[selectedDuration as keyof typeof DURATION_TOKEN];

  const handleDurationChange = (value: string) => {
    setSelectedDuration(value);
  };

  const handlePlayAnimation = () => {
    setIsAnimating(true);

    // Reset animation after it completes
    setTimeout(() => {
      setIsAnimating(false);
    }, durationMs + 100);
  };

  const getCSSCode = () => {
    return `transition-duration: ${durationMs}ms; transition-timing-function: ${easing.value};`;
  };

  return (
    <div className="flex flex-col gap-2 items-start p-2 border border-gray-200 rounded-md overflow-hidden">
      <div className="w-full h-[7.5rem] rounded bg-gray-200 relative overflow-hidden">
        <div
          className={`absolute top-[60%] w-6 h-6 bg-[#B608FF] rounded transform -translate-y-1/2 ${
            isAnimating ? "left-[calc(100%-2.5rem)]" : "left-4"
          }`}
          style={{
            transition: isAnimating
              ? `transform 0ms, left ${durationMs}ms ${easing.value}`
              : "none",
          }}
        />
        <div className="flex items-center justify-between p-2">
          <p className="text-xs text-mono text-gray-600 pl-1">Preview</p>
          <Button
            className="shadow-non cursor-pointer shadow-none z-10"
            variant="secondary"
            size="smallIcon"
            onClick={handlePlayAnimation}
            disabled={isAnimating}
          >
            <Play className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1 items-start">
        <h3 className="font-medium">{easing.name}</h3>
        <div className="flex flex-col gap-2 text-mono">
          <Select
            defaultValue={selectedDuration}
            onValueChange={handleDurationChange}
          >
            <SelectTrigger className="w-full rounded border-none shadow-none bg-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-gray-50 shadow-none border rounded bg-white">
              <SelectGroup>
                <SelectLabel>Duration token</SelectLabel>
                {Object.entries(DURATION_TOKEN).map(([token, value]) => (
                  <SelectItem key={token} value={token}>
                    {token} ({value}ms)
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <div className="flex items-center gap-2 px-2 text-sm text-mono rounded bg-gray-100">
              {easing.previewValue}
            </div>
            <Button
              className="shadow-non cursor-pointer shadow-none"
              variant="secondary"
              size="smallIcon"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          {/* CSS Output Code Block */}
          <div className="w-full mt-2 p-3 bg-neutral-500 text-gray-50 rounded text-xs font-mono">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-xs">CSS</span>
              <Button
                className="shadow-non cursor-pointer shadow-none"
                variant="secondary"
                size="smallIcon"
                onClick={() => navigator.clipboard.writeText(getCSSCode())}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="w-full">
              <code className="block whitespace-pre-wrap break-all text-xs">
                {getCSSCode()}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
