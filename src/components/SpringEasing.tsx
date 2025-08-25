import { Copy, Play } from "lucide-react";
import { useState, useRef } from "react";
import { animate } from "motion";

import { Button } from "./ui/button";
import { SPRING_CONFIGS, type SpringConfig } from "../lib/spring-easings";

interface Props {
  config?: SpringConfig;
  isCustom?: boolean;
}

// Default spring configurations

export const SpringEasing = ({
  config = SPRING_CONFIGS[0],
  isCustom = false,
}: Props) => {
  const [stiffness, setStiffness] = useState(config.stiffness);
  const [damping, setDamping] = useState(config.damping);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animateRight, setAnimateRight] = useState(true); // Track animation direction
  const dotRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);

  const handlePlayAnimation = () => {
    if (!dotRef.current || isAnimating) return;

    setIsAnimating(true);

    // Stop any current animation
    if (controlsRef.current) {
      controlsRef.current.stop();
    }

    // Calculate target position based on container width
    const container = dotRef.current.parentElement;
    const dotWidth = dotRef.current.offsetWidth;
    const containerWidth = container
      ? container.clientWidth - dotWidth - 32
      : 200;

    // Set animation target based on current direction
    const fromX = animateRight ? 0 : containerWidth;
    const toX = animateRight ? containerWidth : 0;

    // Animate with spring physics
    controlsRef.current = animate(
      dotRef.current,
      { translateX: [fromX, toX] },
      {
        type: "spring",
        stiffness,
        damping,
        onComplete: () => {
          setIsAnimating(false);
          // Toggle direction for next animation
          setAnimateRight(!animateRight);
        },
      }
    );
  };

  const getJSCode = () => {
    return `{
    type: "spring",
    stiffness: ${stiffness},
    damping: ${damping}
}`;
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: string,
    min: number
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setter(Math.max(min, numValue));
    }
  };

  return (
    <div className="flex flex-col gap-2 items-start p-2 border border-gray-200 rounded-md overflow-hidden">
      {/* Preview area */}
      <div className="w-full h-[7.5rem] rounded bg-gray-200 relative overflow-hidden">
        <div
          ref={dotRef}
          className="absolute top-[60%] w-6 h-6 bg-[#B608FF] rounded -translate-y-1/2"
          style={{ left: 16 }}
        />
        <div className="flex items-center justify-between p-2">
          <p className="text-xs text-mono text-gray-600 pl-1">Spring Preview</p>
          <Button
            className="shadow-non cursor-pointer shadow-none z-10"
            variant="secondary"
            size="smallIcon"
            onClick={handlePlayAnimation}
            // disabled={isAnimating}
          >
            <Play className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Controls section */}
      <div className="flex flex-col gap-1 items-start w-full">
        <h3 className="font-medium">{config.name}</h3>

        <div className="flex flex-col gap-2 text-mono w-full">
          {/* Spring controls */}
          {isCustom && (
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">Stiffness</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    value={stiffness}
                    onChange={(e) => setStiffness(Number(e.target.value))}
                    className="w-24"
                  />
                  <input
                    type="text"
                    value={stiffness}
                    onChange={(e) =>
                      handleInputChange(setStiffness, e.target.value, 10)
                    }
                    className="w-12 text-xs p-1 border border-gray-200 rounded text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">Damping</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={damping}
                    onChange={(e) => setDamping(Number(e.target.value))}
                    className="w-24"
                  />
                  <input
                    type="text"
                    value={damping}
                    onChange={(e) =>
                      handleInputChange(setDamping, e.target.value, 0)
                    }
                    className="w-12 text-xs p-1 border border-gray-200 rounded text-center"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-1">
            <div className="flex items-center gap-2 px-2 text-sm text-mono rounded bg-gray-100">
              spring({stiffness}, {damping})
            </div>
            <Button
              className="shadow-non cursor-pointer shadow-none"
              variant="secondary"
              size="smallIcon"
              onClick={() =>
                navigator.clipboard.writeText(
                  `spring(${stiffness}, ${damping})`
                )
              }
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          {/* JS Code Output Block */}
          <div className="w-full mt-2 p-3 bg-neutral-500 text-gray-50 rounded text-xs font-mono">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-xs">JavaScript</span>
              <Button
                className="shadow-non cursor-pointer shadow-none"
                variant="secondary"
                size="smallIcon"
                onClick={() => navigator.clipboard.writeText(getJSCode())}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="w-full">
              <code className="block whitespace-pre-wrap break-all text-xs">
                {getJSCode()}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
