import { useState, useRef, useEffect } from "react";
import { animate } from "motion";
import "./BouncePreview.css";

// Define animation positions
const LEFT_POSITION = 150;
const RIGHT_POSITION = 350;

// Define animation variants
type AnimationVariant =
  | "left"
  | "right"
  | "animating-to-left"
  | "animating-to-right";

const BouncePreview = () => {
  const [stiffness, setStiffness] = useState(330);
  const [damping, setDamping] = useState(30);
  const [currentVariant, setCurrentVariant] =
    useState<AnimationVariant>("left");
  const boxRef = useRef<HTMLDivElement>(null);
  // Use a more specific type for the animation controls
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);

  // Set initial position when the component mounts
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.style.transform = `translateX(${LEFT_POSITION}px)`;
    }
  }, []);

  const playAnimation = () => {
    if (!boxRef.current) return;

    // Determine target based on current position
    const isCurrentlyLeft =
      currentVariant === "left" || currentVariant === "animating-to-left";
    const targetPosition = isCurrentlyLeft ? RIGHT_POSITION : LEFT_POSITION;
    const targetVariant = isCurrentlyLeft
      ? "animating-to-right"
      : "animating-to-left";

    // Update animation state
    setCurrentVariant(targetVariant);

    // Stop any current animation
    if (controlsRef.current) {
      controlsRef.current.stop();
    }

    // Create new animation
    controlsRef.current = animate(
      boxRef.current,
      { x: targetPosition },
      {
        type: "spring",
        stiffness: stiffness,
        damping: damping,
        onComplete: () => {
          // Update to final state
          setCurrentVariant(isCurrentlyLeft ? "right" : "left");
        },
      }
    );
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
    <div className="flex flex-col gap-6 p-6 bg-white rounded-xl shadow-md text-gray-600">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium text-gray-800">
          Bounce Animation Preview
        </h3>
        <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">
          spring({stiffness}, {damping})
        </div>
      </div>

      <div className="h-20 bg-gray-100 rounded-xl relative overflow-hidden">
        <div
          ref={boxRef}
          className="h-16 w-16 absolute top-2 left-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg"
        ></div>
      </div>

      <div className="flex flex-col gap-4 p-4 rounded-2xl bg-gray-100">
        <div className="flex justify-between items-center">
          <div className="font-medium text-gray-600">Stiffness:</div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="1000"
              value={stiffness}
              onChange={(e) => setStiffness(Number(e.target.value))}
              className="w-48"
            />
            <input
              type="text"
              value={stiffness}
              onChange={(e) =>
                handleInputChange(setStiffness, e.target.value, 1)
              }
              className="w-16 p-1 text-center border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="font-medium text-gray-600">Damping:</div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={damping}
              onChange={(e) => setDamping(Number(e.target.value))}
              className="w-48"
            />
            <input
              type="text"
              value={damping}
              onChange={(e) => handleInputChange(setDamping, e.target.value, 0)}
              className="w-16 p-1 text-center border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={playAnimation}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Play Animation
        </button>

        <button
          onClick={() => {
            setStiffness(100);
            setDamping(10);
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Default
        </button>

        <button
          onClick={() => {
            setStiffness(330);
            setDamping(30);
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Reveal
        </button>

        <button
          onClick={() => {
            setStiffness(330);
            setDamping(35);
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default BouncePreview;
