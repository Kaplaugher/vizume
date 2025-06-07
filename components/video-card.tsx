import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Eye, EyeOff } from 'lucide-react';

const VideoCard = ({
  id,
  title,
  thumbnail,
  createdAt,
  userImage,
  views,
  visibility,
}: {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  userImage: string;
  views: number;
  visibility: string;
}) => {
  return (
    <div className="w-full">
      <Link href={`/video/${id}`} className="relative block">
        <div className="group overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
          <img
            alt=""
            src={thumbnail}
            className="pointer-events-none aspect-video w-full object-cover group-hover:opacity-75"
          />
          <button type="button" className="absolute inset-0 focus:outline-none">
            <span className="sr-only">View details for {title}</span>
          </button>
        </div>
        <div className="mt-2 flex gap-2">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={userImage} alt="User avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium text-gray-900">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <span>{views} views</span>
              <span>•</span>
              <span>{createdAt}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                {visibility === 'public' ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
                <span className="capitalize">{visibility}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;
