import { useState, useRef, useEffect } from "react";
import "./BezierPreview.css";

interface Point {
  x: number;
  y: number;
}

const BezierPreview = () => {
  // Default cubic bezier values (ease)
  const [controlPoint1, setControlPoint1] = useState<Point>({
    x: 0.25,
    y: 0.1,
  });
  const [controlPoint2, setControlPoint2] = useState<Point>({ x: 0.25, y: 1 });
  const [animationInProgress, setAnimationInProgress] = useState(false);
  const [customBezierString, setCustomBezierString] = useState("");
  const [animationDuration, setAnimationDuration] = useState(500);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  const width = 300;
  const height = 300;
  const padding = 30;

  // Convert normalized coordinates (0-1) to canvas coordinates
  const normalizedToCanvas = (point: Point): Point => {
    return {
      x: padding + point.x * (width - 2 * padding),
      y: height - padding - point.y * (height - 2 * padding),
    };
  };

  // Convert canvas coordinates to normalized coordinates (0-1)
  const canvasToNormalized = (point: Point): Point => {
    return {
      x: (point.x - padding) / (width - 2 * padding),
      y: (height - padding - point.y) / (height - 2 * padding),
    };
  };

  // Update the bezier string in CSS format
  useEffect(() => {
    const bezierString = `cubic-bezier(${controlPoint1.x.toFixed(
      2
    )}, ${controlPoint1.y.toFixed(2)}, ${controlPoint2.x.toFixed(
      2
    )}, ${controlPoint2.y.toFixed(2)})`;
    setCustomBezierString(bezierString);
  }, [controlPoint1, controlPoint2]);

  // Draw the bezier curve and control points
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw the grid
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;

    // Draw horizontal and vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const pos = padding + (i / 10) * (width - 2 * padding);

      // Horizontal grid line
      ctx.beginPath();
      ctx.moveTo(padding, pos);
      ctx.lineTo(width - padding, pos);
      ctx.stroke();

      // Vertical grid line
      ctx.beginPath();
      ctx.moveTo(pos, padding);
      ctx.lineTo(pos, height - padding);
      ctx.stroke();
    }

    // Draw the container box
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, padding, width - 2 * padding, height - 2 * padding);

    // Start point
    const startPoint = normalizedToCanvas({ x: 0, y: 0 });
    // End point
    const endPoint = normalizedToCanvas({ x: 1, y: 1 });
    // Control points
    const cp1 = normalizedToCanvas(controlPoint1);
    const cp2 = normalizedToCanvas(controlPoint2);

    // Draw the bezier curve
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, endPoint.x, endPoint.y);
    ctx.strokeStyle = "#4a90e2";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw control point lines
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(cp1.x, cp1.y);
    ctx.moveTo(endPoint.x, endPoint.y);
    ctx.lineTo(cp2.x, cp2.y);
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw control points
    const drawControlPoint = (point: Point, color: string) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    drawControlPoint(cp1, "#ff7f50");
    drawControlPoint(cp2, "#8a2be2");

    // Draw start and end points
    drawControlPoint(startPoint, "#333");
    drawControlPoint(endPoint, "#333");
  }, [controlPoint1, controlPoint2]);

  // Handle control point drag
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const cp1 = normalizedToCanvas(controlPoint1);
    const cp2 = normalizedToCanvas(controlPoint2);

    // Check if mouse is on a control point
    const isOnPoint = (point: Point) => {
      return (
        Math.sqrt(
          Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2)
        ) < 10
      );
    };

    let draggingPoint: "cp1" | "cp2" | null = null;

    if (isOnPoint(cp1)) {
      draggingPoint = "cp1";
    } else if (isOnPoint(cp2)) {
      draggingPoint = "cp2";
    }

    if (!draggingPoint) return;

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Convert to normalized coordinates and update state
      const normalizedPoint = canvasToNormalized({ x: mouseX, y: mouseY });

      // Clamp x values between 0 and 1
      const clampedPoint = {
        x: Math.max(0, Math.min(1, normalizedPoint.x)),
        y: normalizedPoint.y,
      };

      if (draggingPoint === "cp1") {
        setControlPoint1(clampedPoint);
      } else if (draggingPoint === "cp2") {
        setControlPoint2(clampedPoint);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle input changes
  const handleInputChange = (
    point: "cp1" | "cp2",
    coord: "x" | "y",
    value: string
  ) => {
    const numValue = parseFloat(value);
    // if (isNaN(numValue)) return;

    if (point === "cp1") {
      setControlPoint1((prev) => ({
        ...prev,
        [coord]: coord === "x" ? Math.max(0, Math.min(1, numValue)) : numValue,
      }));
    } else {
      setControlPoint2((prev) => ({
        ...prev,
        [coord]: coord === "x" ? Math.max(0, Math.min(1, numValue)) : numValue,
      }));
    }
  };

  // Play animation
  const playAnimation = () => {
    if (animationInProgress) return;

    const dot = dotRef.current;
    if (!dot) return;

    setAnimationInProgress(true);

    dot.style.transition = "none";
    dot.style.transform = "translateX(0)";

    // Force a reflow
    void dot.offsetWidth;

    dot.style.transition = `transform ${animationDuration}MS ${customBezierString}`;
    dot.style.transform = "translateX(420px)";

    setTimeout(() => {
      setAnimationInProgress(false);
    }, animationDuration);
  };

  return (
    <div className="bezier-preview-container">
      <div className="bezier-preview-header">
        <h3>Cubic Bezier Preview</h3>
        <div className="bezier-value">{customBezierString}</div>
      </div>

      <div className="bezier-canvas-container">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
        />

        <div className="animation-preview">
          <div className="animation-track">
            <div ref={dotRef} className="animation-dot"></div>
          </div>
          <button
            className="play-button"
            onClick={playAnimation}
            disabled={animationInProgress}
          >
            Play Animation
          </button>
        </div>
      </div>

      <div className="flex justify-between p-4 rounded-2xl bg-gray-100">
        <div className="flex flex-col gap-4">
          <div className="text-gray-600 font-medium">Control Point 1:</div>
          <div className="point-inputs text-gray-600">
            <label>
              X:
              <input
                type="text"
                value={controlPoint1.x}
                onChange={(e) => handleInputChange("cp1", "x", e.target.value)}
              />
            </label>
            <label>
              Y:
              <input
                type="text"
                value={controlPoint1.y}
                onChange={(e) => handleInputChange("cp1", "y", e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-gray-600">
          <div className="font-medium">Control Point 2:</div>
          <div className="point-inputs">
            <label>
              X:
              <input
                type="text"
                value={controlPoint2.x}
                onChange={(e) => handleInputChange("cp2", "x", e.target.value)}
              />
            </label>
            <label>
              Y:
              <input
                type="text"
                placeholder="Y"
                value={controlPoint2.y}
                onChange={(e) => handleInputChange("cp2", "y", e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center p-4 rounded-2xl bg-gray-100 text-gray-600">
        <div className=" font-medium">Animation Duration:</div>
        <div className="duration-input">
          <input
            type="text"
            value={animationDuration}
            onChange={(e) =>
              setAnimationDuration(
                Math.max(70, parseFloat(e.target.value) || 70)
              )
            }
          />
          <span className="duration-unit">MS</span>
        </div>
      </div>

      <div className="flex gap-4 items-center p-4 rounded-2xl bg-gray-100 text-gray-600">
        <button
          onClick={() => {
            setControlPoint1({ x: 0.25, y: 0.1 });
            setControlPoint2({ x: 0.25, y: 1 });
          }}
        >
          Ease
        </button>
        <button
          onClick={() => {
            setControlPoint1({ x: 0.42, y: 0 });
            setControlPoint2({ x: 0.58, y: 1 });
          }}
        >
          Ease-In-Out
        </button>
        <button
          onClick={() => {
            setControlPoint1({ x: 0.42, y: 0 });
            setControlPoint2({ x: 1, y: 1 });
          }}
        >
          Ease-In
        </button>
        <button
          onClick={() => {
            setControlPoint1({ x: 0, y: 0 });
            setControlPoint2({ x: 0.4, y: 1 });
          }}
        >
          Ease-Out
        </button>
      </div>
    </div>
  );
};

export default BezierPreview;
