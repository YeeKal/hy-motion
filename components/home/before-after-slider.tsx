"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  width?: number;
  height?: number;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  width = 400,
  height = 300,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | undefined>();
  const [containerHeight, setContainerHeight] = useState<number | undefined>();

  useEffect(() => {
    if (sliderRef.current) {
      const sliderRect = sliderRef.current.getBoundingClientRect();
      setContainerWidth(sliderRect.width);
      setContainerHeight(sliderRect.height);
    }

    const handleResize = () => {
      if (sliderRef.current) {
        const sliderRect = sliderRef.current.getBoundingClientRect();
        setContainerWidth(sliderRect.width);
        setContainerHeight(sliderRect.height);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const offsetX =
      "touches" in event
        ? event.touches[0].clientX - sliderRect.left
        : (event as React.MouseEvent).clientX - sliderRect.left;

    const newSliderPosition = (offsetX / sliderRect.width) * 100;
    setSliderPosition(Math.min(100, Math.max(0, newSliderPosition)));
  };

  // Add global event listeners to handle cases where mouse is released outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, []);

  return (
    <div
      ref={sliderRef}
      className="relative w-full h-full cursor-col-resize select-none rounded-lg overflow-hidden"
      style={{ width, height }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleMouseMove}
    >
      {/* Before Image (Background) */}
      <Image
        src={beforeImage || "/placeholder.svg"}
        alt={beforeAlt}
        width={width}
        height={height}
        className="absolute top-0 left-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* After Image (Revealed) */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <div style={{ width: containerWidth, height: containerHeight }}>
          <Image
            src={afterImage || "/placeholder.svg"}
            alt={afterAlt}
            width={width}
            height={height}
            className="object-cover top-0 w-full h-full"
            draggable={false}
          />
        </div>
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 h-full bg-white w-0.5 shadow-lg pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      />

      {/* Slider Handle */}
      <div
        className={`absolute flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-lg ${
          isDragging ? "scale-110" : ""
        } transition-transform`}
        style={{
          left: `${sliderPosition}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          handleMouseDown();
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          handleMouseDown();
        }}
      >
        <div className="flex space-x-0.5">
          <div className="w-0.5 h-4 bg-gray-400 rounded"></div>
          <div className="w-0.5 h-4 bg-gray-400 rounded"></div>
        </div>
      </div>
    </div>
  );
}
