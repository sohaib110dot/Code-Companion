import React from "react";
import { Clock, Music } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { VideoInfoResponse } from "@workspace/api-client-react/src/generated/api.schemas";
import { motion } from "framer-motion";

interface VideoPreviewProps {
  data: VideoInfoResponse;
}

export function VideoPreview({ data }: VideoPreviewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="w-full bg-card rounded-2xl overflow-hidden border border-border shadow-sm flex flex-col sm:flex-row"
    >
      <div className="relative w-full sm:w-64 aspect-video sm:aspect-auto bg-muted shrink-0">
        <img 
          src={data.thumbnail} 
          alt={data.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDuration(data.duration)}
        </div>
      </div>
      
      <div className="p-5 sm:p-6 flex flex-col justify-center flex-1">
        <h3 className="font-display font-bold text-lg sm:text-xl line-clamp-2 leading-tight mb-2">
          {data.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto pt-4 border-t border-border/50">
          <Music className="w-4 h-4 text-primary" />
          Ready to convert to MP3
        </div>
      </div>
    </motion.div>
  );
}
