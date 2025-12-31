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
  const grid = new THREE.GridHelper(10, 20, "#666", "#333");
  const axis = new THREE.AxesHelper(1.2);
  return <primitive object={new THREE.Group().add(grid, axis)} />;
}

function FbxModel({ url }: { url: string }) {
  const group = useRef<THREE.Group>(null!);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    if (!url || !group.current) return;

    // 1. 标志位：防止竞态条件 (Race Condition)
    // 如果组件卸载或 url 变化，此标志位变为 true
    let isCancelled = false;

    const loader = new FBXLoader();

    loader.load(
      url,
      (fbx) => {
        // 2. 如果当前 effect 已被清理（说明 url 换了），直接丢弃结果，不添加到场景中
        if (isCancelled) return;

        // 清理当前 group 下的旧内容（双重保险）
        cleanGroup(group.current);

        fbx.scale.setScalar(0.01);

        // Auto-center
        const box = new THREE.Box3().setFromObject(fbx);
        const center = box.getCenter(new THREE.Vector3());
        fbx.position.sub(center);

        // Animation
        if (fbx.animations?.length) {
          const mixer = new THREE.AnimationMixer(fbx);
          mixer.clipAction(fbx.animations[0]).play();
          mixerRef.current = mixer;
        }
        
        // 开启阴影
        fbx.traverse((c) => {
           if (c instanceof THREE.Mesh) {
             c.castShadow = true;
             c.receiveShadow = true;
           }
        });

        group.current.add(fbx);
      },
      (xhr) => {
        // 可选：加载进度
        // console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (err) => {
        if (!isCancelled) console.error("FBX load error:", err);
      }
    );

    // --- Cleanup Function ---
    return () => {
      isCancelled = true; // 标记此轮 effect 失效
      
      // 停止动画
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }

      // 深度清理几何体和材质，防止内存泄漏
      if (group.current) {
        cleanGroup(group.current);
      }
    };
  }, [url]);

  useFrame((_, delta) => {
    mixerRef.current?.update(delta);
  });

  return <group ref={group} />;
}

// 辅助函数：深度清理 Three.js 对象
function cleanGroup(group: THREE.Group) {
  // 1. 遍历并释放资源
  group.traverse((object: any) => {
    if (object.isMesh) {
      if (object.geometry) object.geometry.dispose();
      
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((m: any) => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    }
  });
  
  // 2. 移除所有子对象
  group.clear();
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
    <div className="relative w-full h-full bg-neutral-900 rounded-xl overflow-hidden shadow-inner border border-neutral-800">
      <Canvas shadows camera={{ position: [7, 5, 14], fov: 40 }}>
        <color attach="background" args={['#1a1a1a']} />
        
        <ambientLight intensity={0.6} />
        <directionalLight 
            position={[5, 10, 7.5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024} 
        />

        <Helpers />

        {/* 使用 key 强制重置组件也是一种可选策略，但上面的内部修复性能更好 */}
        {url && <FbxModel url={url} />}

        <OrbitControls enableDamping minPolarAngle={0} maxPolarAngle={Math.PI / 1.9} />
      </Canvas>

      {/* Download Button */}
      {url && !isLoading && (
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-md bg-white text-black hover:bg-neutral-200 shadow-lg text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Download FBX
          </button>
        </div>
      )}
    </div>
  );
}