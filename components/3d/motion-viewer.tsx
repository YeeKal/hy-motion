"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three-stdlib";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export type FbxViewerProps = {
  url: string | null;
  isLoading?: boolean;
  statusText?: string;
};

function Helpers() {
  // grid + xyz axis
  const grid = new THREE.GridHelper(10, 20, "#666", "#333");
  const axis = new THREE.AxesHelper(1.2);
  return <primitive object={new THREE.Group().add(grid, axis)} />;
}

function FbxModel({ url }: { url: string }) {
  const group = useRef<THREE.Group>(null!);
  const mixerRef = useRef<THREE.AnimationMixer>();

  useEffect(() => {
    if (!url) return;

    const loader = new FBXLoader();
    const container = new THREE.Group();
    group.current.add(container);

    loader.load(
      url,
      (fbx) => {
        // normalize scale
        fbx.scale.setScalar(0.01);

        // auto-center model
        const box = new THREE.Box3().setFromObject(fbx);
        const center = box.getCenter(new THREE.Vector3());
        fbx.position.sub(center);

        // play animation
        if (fbx.animations?.length) {
          const mixer = new THREE.AnimationMixer(fbx);
          mixer.clipAction(fbx.animations[0]).play();
          mixerRef.current = mixer;
        }

        container.add(fbx);
      },
      undefined,
      (err) => console.error("FBX load error:", err)
    );

    return () => {
      mixerRef.current?.stopAllAction();
      container.clear();
      group.current.remove(container);
    };
  }, [url]);

  useFrame((_, d) => mixerRef.current?.update(d));

  return <group ref={group} />;
}

export default function FbxViewer({
  url,
  isLoading = false,
  statusText,
}: FbxViewerProps) {
  const handleDownload = () => {
    if (!url) return;
    const a = document.createElement("a");
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    a.href = url;
    a.download = `motion-${ts}.fbx`;
    a.click();
  };

  const showOverlay = isLoading || !!statusText;

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
      <Canvas camera={{ position: [7, 5, 14], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} />

        {/* helpers always visible */}
        <Helpers />

        {/* only render model when url exists */}
        {url && <FbxModel url={url} />}

        <OrbitControls enableDamping />
      </Canvas>

      {/* Overlay with highlighted text */}
      {showOverlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-4 py-2 rounded-md bg-black/70 text-white text-sm shadow-lg">
            {statusText ?? (isLoading ? "Loading FBX…" : "")}
          </div>
        </div>
      )}

      {/* download button (only when FBX exists) */}
      {url && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-white/90 hover:bg-white shadow
                       text-sm font-medium"
          >
            Download FBX
          </button>
        </div>
      )}
    </div>
  );
}
