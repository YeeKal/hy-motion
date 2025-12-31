"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Capability = {
  id: string;
  title: string;
  description: string;
  images: {
    src: string;
    alt: string;
    caption: string;
  }[];
};

const capabilities: Capability[] = [
  {
    id: "character-consistency",
    title: "Character Consistency",
    description:
      "Preserve unique elements of an image, such as a reference character or object in a picture, across multiple scenes and environments.",
    images: [
      {
        src: "https://cdn.kontextflux.io/img-editor/girl-coffee.webp",
        alt: "woman-holding-coffee",
        caption: "Original: A dancing woman",
      },
      {
        src: "https://cdn.kontextflux.io/img-editor/generation-girl-street.webp",
        alt: "woman-holding-coffee-on-street",
        caption: "Place this woman in a bustling city street, keeping her white shirt, black pants, and coffee cup consistent",
      },
    ],
  },
  {
    id: "local-editing",
    title: "Local Editing",
    description:
      "Make targeted modifications of specific elements in an image without affecting the rest.",
    images: [
      {
        src: "https://cdn.kontextflux.io/img-editor/paris-bilal.webp",
        alt: "dragon",
        caption: "Original: Giant Dragon",
      },
      {
        src: "https://cdn.kontextflux.io/img-editor/dinosaur-with-volcabo.webp",
        alt: "dragon-volcano",
        caption: "Prompt: Add a volcanic background with lava flows, then change the dinosaur's mouth to show fire, and finally adjust the lighting to a dramatic orange hue",
      },
    ],
  },
  {
    id: "style-reference",
    title: "Style Reference",
    description:
      "Generate novel scenes while preserving unique styles from a reference image, directed by text prompts.",
    images: [
      {
        src: "https://cdn.kontextflux.io/img-editor/woman-with-dog.webp",
        alt: "woman-with-dog",
        caption: "Original: Woman with a dog",
      },
      {
        src: "https://cdn.kontextflux.io/img-editor/generation-woman-with-dog-neon.webp",
        alt: "woman-with-dog-neon",
        caption: `Apply a cyberpunk neon aesthetic to this image.`,
      },
    ],
  },
  {
    id: "interactive-speed",
    title: "Interactive Speed",
    description: "Minimal latency for both image generation and editing.",
    images: [
      {
        src: "https://cdn.kontextflux.io/img-editor/apple-watch.webp",
        alt: "apple watch",
        caption: "Original: Apple Watch",
      },
      {
        src: "https://cdn.kontextflux.io/img-editor/generation-apple-watch-display-in-living-room.webp",
        alt: "apple watch in room",
        caption: `Prompt: Place this watch on a sleek wooden table in a modern living room.`,
      },
    ],
  },
];

const CYCLE_INTERVAL_MS = 3000; // Time each capability is displayed
const TRANSITION_DURATION_MS = 500; // Duration of fade transition

export default function FluxCapabilities() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progressKey, setProgressKey] = useState(0); // To reset progress bar animation

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentCapability = capabilities[activeIndex];

  // Function to change capability with transition
  const selectCapability = useCallback((index: number) => {
    // Check against the current activeIndex from state, not a stale closure one.
    // This function will be memoized, so activeIndex in its deps will ensure it's up-to-date.
    if (index === activeIndex && !isTransitioning) {
      // If already selected and not transitioning, do nothing
      // Or if trying to transition to the current one while already transitioning to it
      if (transitionTimeoutRef.current && index === activeIndex) return;
    }
    
    setIsTransitioning(true);

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
      setProgressKey((prevKey) => prevKey + 1); // Increment key to force re-render/re-animation
    }, TRANSITION_DURATION_MS);
  }, [activeIndex, isTransitioning]); // Dependencies for useCallback

  // Auto-cycling effect
  useEffect(() => {
    if (capabilities.length <= 1 || isTransitioning) {
      // If transitioning, the interval will be cleared and restarted by this effect
      // once isTransitioning becomes false and activeIndex is updated.
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      // Pass the *target* next index to selectCapability.
      // `activeIndex` in this closure is the one current when interval was set.
      const nextIdx = (activeIndex + 1) % capabilities.length;
      selectCapability(nextIdx);
    }, CYCLE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  // Restart interval if activeIndex changes (e.g. manual select),
  // or when a transition completes (isTransitioning becomes false).
  }, [activeIndex, capabilities.length, isTransitioning, selectCapability]);

  // Handle manual selection via buttons or dots
  const handleUserSelect = (index: number) => {
    if (index === activeIndex && !isTransitioning) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Stop current auto-cycle
    }
    selectCapability(index); // selectCapability will handle transition and update activeIndex
    // The main useEffect [activeIndex, isTransitioning] will restart the interval
  };

  // Initial progress bar animation trigger
  useEffect(() => {
    setProgressKey(k => k + 1);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  if (!currentCapability) {
    // Should not happen if capabilities array is not empty
    return <div>Loading capabilities...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mb-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-4xl font-bold bg-clip-text">
            What you can do with FLUX.1 Kontext
          </h2>
          <Badge
            variant="secondary"
            className="text-sm border-2 border-muted bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            Suite
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto"></p>
      </div>

      {/* Selected Capability Display */}
      <Card className="max-w-5xl mx-auto">
        <CardContent className=""> {/* Default shadcn padding p-6 pt-0 will apply */}
          <div className="space-y-6"> {/* Add pt-6 here if CardContent has pt-0 */}
            <div className="flex justify-center items-center ">
              <div className="flex flex-wrap justify-center gap-2 bg-muted rounded-lg p-2 shadow-inner">
                {capabilities.map((capability, index) => (
                  <Button
                    key={capability.id}
                    variant={
                      activeIndex === index
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleUserSelect(index)}
                    aria-label={`Select ${capability.title}`}
                  >
                    <span className="font-semibold">{capability.title}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Content that fades */}
            <div
              className={`transition-opacity ease-in-out space-y-4 duration-[${TRANSITION_DURATION_MS}ms] ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              <p className="text-muted-foreground text-center min-h-[4em] sm:min-h-[3em]"> {/* Added min-height to reduce layout shift */}
                {currentCapability.description}
              </p>

              {/* Image Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mx-auto">
                {currentCapability.images.map((image, imgIndex) => (
                  <div key={imgIndex} className="space-y-3 text-center">
                    <div className="relative overflow-hidden rounded-lg border bg-muted mx-auto aspect-[4/3]">
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition-transform group-hover:scale-105" // group-hover won't work without a group parent
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {image.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicator Dots */}
            <div className="flex justify-center space-x-2 pt-2">
              {capabilities.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => handleUserSelect(index)}
                  aria-label={`Go to ${capabilities[index].title}`}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                    ${activeIndex === index ? 'bg-primary scale-125' : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'}`}
                />
              ))}
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}