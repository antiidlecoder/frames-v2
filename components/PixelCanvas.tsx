import React, { useState, useRef, useEffect } from "react";

interface PixelCanvasProps {
  canvasSize?: number;
  pixelSize?: number;
  defaultColor?: string;
}

const PixelCanvas: React.FC<PixelCanvasProps> = ({
  canvasSize = 500,
  pixelSize = 10,
  defaultColor = "#000000",
}) => {
  const [color, setColor] = useState(defaultColor);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill canvas with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw grid
    ctx.strokeStyle = "#e5e5e5";
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let i = 0; i <= canvasSize; i += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(i + 0.5, 0);
      ctx.lineTo(i + 0.5, canvasSize);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let i = 0; i <= canvasSize; i += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(0, i + 0.5);
      ctx.lineTo(canvasSize, i + 0.5);
      ctx.stroke();
    }
  }, [canvasSize, pixelSize]);

  const draw = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = (x - rect.left) * scaleX;
    const canvasY = (y - rect.top) * scaleY;

    const gridX = Math.floor(canvasX / pixelSize) * pixelSize;
    const gridY = Math.floor(canvasY / pixelSize) * pixelSize;

    ctx.fillStyle = color;
    ctx.fillRect(gridX, gridY, pixelSize, pixelSize);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    draw(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta * 0.5)));
  };

  const canvasStyle: React.CSSProperties = {
    width: `${canvasSize * zoom}px`,
    height: `${canvasSize * zoom}px`,
    imageRendering: zoom >= 1 ? "pixelated" : "auto",
    cursor: "crosshair",
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-8 w-16 cursor-pointer"
        />
        <button
          onClick={() => handleZoom(1)}
          className="px-3 py-1 bg-slate-800 text-white rounded"
          disabled={zoom >= 3}
        >
          +
        </button>
        <button
          onClick={() => handleZoom(-1)}
          className="px-3 py-1 bg-slate-800 text-white rounded"
          disabled={zoom <= 0.5}
        >
          -
        </button>
      </div>

      <div className="border border-gray-300 overflow-auto">
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          style={canvasStyle}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </div>
  );
};

export default PixelCanvas;
