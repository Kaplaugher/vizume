'use client';
import { daysAgo } from '@/lib/utils';
import { deleteVideo, updateVideoVisibility } from '@/lib/actions/video';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { visibilities } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Link, Eye, Trash2, ChevronDown, Check } from 'lucide-react';

const VideoDetailHeader = ({
  title,
  createdAt,
  userImg,
  username,
  videoId,
  ownerId,
  visibility,
  thumbnailUrl,
}: VideoDetailHeaderProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [visibilityState, setVisibilityState] = useState<Visibility>(
    visibility as Visibility
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;
  const isOwner = userId === ownerId;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteVideo(videoId, thumbnailUrl);
      router.push('/');
    } catch (error) {
      console.error('Error deleting video:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVisibilityChange = async (option: string) => {
    if (option !== visibilityState) {
      setIsUpdating(true);
      try {
        await updateVideoVisibility(videoId, option as Visibility);
        setVisibilityState(option as Visibility);
      } catch (error) {
        console.error('Error updating visibility:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/video/${videoId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="h-auto p-0 text-left justify-start"
                onClick={() => router.push(`/profile/${ownerId}`)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userImg ?? ''} />
                  <AvatarFallback>{username?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="font-medium">{username ?? 'Guest'}</p>
                  <p className="text-sm text-muted-foreground">
                    {daysAgo(createdAt)}
                  </p>
                </div>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyLink}
              className="gap-2"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Link className="h-4 w-4" />
              )}
              {copied ? 'Copied!' : 'Share'}
            </Button>

            {isOwner && (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUpdating}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      <Badge variant="secondary" className="capitalize">
                        {visibilityState}
                      </Badge>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {visibilities.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => handleVisibilityChange(option)}
                        className="capitalize"
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoDetailHeader;
