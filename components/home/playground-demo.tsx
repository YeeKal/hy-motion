
import { PLAYGROUND_SECTION_ID } from "@/lib/constants";
export default function PlaygroundDemo() {


  const iframeUrl="https://tencent-hy-motion-1-0.hf.space/?__theme=light";

  return (
    <div id={PLAYGROUND_SECTION_ID} className={` scroll-mt-36 relative w-full  mx-auto `}>
      <div className={`aspect-square w-full max-h-[1000px] overflow-hidden rounded-xl border border-gray-200 shadow-sm`}>
        <iframe
          src={iframeUrl}
          title={"HY-Motion Playground Demo"}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="camera; microphone; accelerometer; gyroscope"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

