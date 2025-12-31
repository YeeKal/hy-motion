
import type { ToolConfig } from "@/lib/config/tool-types"
import {GalleryCard} from "./gallery-card"
type ImageGalleryProps = ToolConfig["imageGallery"]

interface ImageGalleryComponentProps {
  imageGallery?: ImageGalleryProps
}


export default function ImageGallery({ imageGallery }: ImageGalleryComponentProps) {
  if (!imageGallery?.images?.length) {
    return <></>
  }

  return (
    <section className="container mx-auto py-20 px-4">
       <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{imageGallery.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{imageGallery.description}</p>
        </div>
     

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              {imageGallery.images.map((img, idx) => (
                                  <GalleryCard key={idx}
                                      item={img}
                                  />
                              ))}
                          </div>
    </section>
  );
}


