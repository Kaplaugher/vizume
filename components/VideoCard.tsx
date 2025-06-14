'use client';

import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Eye, EyeOff, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const VideoCard = ({
  id,
  title,
  thumbnail,
  createdAt,
  userImage,
  views,
  visibility,
  duration,
}: {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  userImage: string;
  views: number;
  visibility: string;
  duration?: string;
}) => {
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('Hello');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Link href={`/video/${id}`} className="block">
          <div className="group relative overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
            <Image
              alt={title}
              src={thumbnail}
              width={300}
              height={300}
              className="pointer-events-none aspect-video w-full object-cover group-hover:opacity-75"
            />
            {duration && (
              <Badge variant="secondary" className="absolute bottom-2 right-2">
                {Math.round(parseInt(duration) / 60)} min
              </Badge>
            )}
            <button
              type="button"
              className="absolute inset-0 focus:outline-none"
            >
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
                <span>{formatDate(createdAt)}</span>
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
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={handleCopy}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default VideoCard;
