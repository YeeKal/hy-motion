import Image from 'next/image'
import { PlayCircle, Clock } from 'lucide-react'

interface VideoCardProps {
  title: string
  thumbnail: string
  duration: string
  views: number
}

export function VideoCard({ title, thumbnail, duration, views }: VideoCardProps) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-background">
      <div className="relative">
        <Image 
          src={thumbnail} 
          alt={title} 
          width={320} 
          height={180} 
          className="w-full"
        />
        <div className="absolute bottom-2 right-2 bg-foreground bg-opacity-75 text-background px-2 py-1 rounded text-xs flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {duration}
        </div>
      </div>
      <div className="px-6 py-4">
        <h3 className="font-bold mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-base flex items-center">
          <PlayCircle className="w-4 h-4 mr-1" />
          {views.toLocaleString()} views
        </p>
      </div>
    </div>
  )
}