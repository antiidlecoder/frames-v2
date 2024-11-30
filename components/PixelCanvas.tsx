import React, { useState, useRef, useEffect } from "react";

interface PixelCanvasProps {
  canvasSize?: number;
  pixelSize?: number;
  defaultColor?: string;
}

interface TouchInfo {
  isDragging: boolean;
  startX: number;
  startY: number;
  scrollLeft: number;
  scrollTop: number;
}

const PixelCanvas: React.FC<PixelCanvasProps> = ({
  canvasSize = 500,
  pixelSize = 10,
  defaultColor = "#000000",
}) => {
  const [color, setColor] = useState(defaultColor);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [touchInfo, setTouchInfo] = useState<TouchInfo>({
    isDragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.strokeStyle = "#e5e5e5";
    ctx.lineWidth = 1;

    for (let i = 0; i <= canvasSize; i += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(i + 0.5, 0);
      ctx.lineTo(i + 0.5, canvasSize);
      ctx.stroke();
    }

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

  // Touch handlers for navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const container = containerRef.current;
      if (!container) return;

      setTouchInfo({
        isDragging: true,
        startX: touch.clientX,
        startY: touch.clientY,
        scrollLeft: container.scrollLeft,
        scrollTop: container.scrollTop,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchInfo.isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const container = containerRef.current;
    if (!container) return;

    const deltaX = touch.clientX - touchInfo.startX;
    const deltaY = touch.clientY - touchInfo.startY;

    container.scrollLeft = touchInfo.scrollLeft - deltaX;
    container.scrollTop = touchInfo.scrollTop - deltaY;
  };

  const handleTouchEnd = () => {
    setTouchInfo((prev) => ({ ...prev, isDragging: false }));
  };

  // Mouse handlers for drawing
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
    touchAction: "none", // Prevent default touch actions
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

      <div
        ref={containerRef}
        className="border border-gray-300 overflow-auto w-full max-w-[90vw] h-[60vh]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
