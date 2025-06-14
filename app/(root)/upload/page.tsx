'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import {
  getThumbnailUploadUrl,
  getVideoUploadUrl,
  getResumeUploadUrl,
  saveVideoDetails,
} from '@/lib/actions/video';
import { useRouter } from 'next/navigation';

type Visibility = 'public' | 'private';

interface FormData {
  title: string;
  description: string;
  visibility: Visibility;
  tags: string;
}

const uploadFileToBunny = (
  file: File,
  uploadUrl: string,
  accessKey: string
) => {
  return fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      AccessKey: accessKey,
    },
    body: file,
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to upload file');
    }
  });
};

const Upload = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    visibility: 'private',
    tags: '',
  });

  useEffect(() => {
    const checkForRecordedVideo = async () => {
      try {
        const stored = sessionStorage.getItem('recordedVideo');
        if (!stored) return;

        const { url, name, type } = JSON.parse(stored);
        const blob = await fetch(url).then((res) => res.blob());
        const file = new File([blob], name, {
          type,
          lastModified: Date.now(),
        });

        // Set the file directly
        setUploadFile(file);

        // Update the file input if it exists
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;
        }

        sessionStorage.removeItem('recordedVideo');
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Error loading recorded video:', err);
      }
    };

    checkForRecordedVideo();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      setError(null); // Clear any previous errors
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
      setError(null); // Clear any previous errors
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResume(file);
      setError(null); // Clear any previous errors
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null); // Clear any previous errors
  };

  const handleVisibilityChange = (value: Visibility) => {
    setFormData((prev) => ({
      ...prev,
      visibility: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    setError(null);

    try {
      // Get video upload URL and upload video
      const {
        videoId,
        uploadUrl: videoUploadUrl,
        accessKey: videoAccessKey,
      } = await getVideoUploadUrl();

      if (!videoUploadUrl || !videoAccessKey) {
        throw new Error('Failed to get upload credentials');
      }

      await uploadFileToBunny(uploadFile, videoUploadUrl, videoAccessKey);

      // Get thumbnail upload URL and upload thumbnail
      const {
        uploadUrl: thumbnailUploadUrl,
        accessKey: thumbnailAccessKey,
        cdnUrl: thumbnailCdnUrl,
      } = await getThumbnailUploadUrl(videoId);

      if (
        !thumbnailUploadUrl ||
        !thumbnailAccessKey ||
        !thumbnailCdnUrl ||
        !thumbnail
      ) {
        throw new Error('Failed to get thumbnail upload credentials');
      }

      await uploadFileToBunny(
        thumbnail,
        thumbnailUploadUrl,
        thumbnailAccessKey
      );

      // Handle resume upload if provided
      let resumeCdnUrl: string | undefined;
      if (resume) {
        const {
          uploadUrl: resumeUploadUrl,
          accessKey: resumeAccessKey,
          cdnUrl: resumeUrl,
        } = await getResumeUploadUrl(videoId);

        if (!resumeUploadUrl || !resumeAccessKey || !resumeUrl) {
          throw new Error('Failed to get resume upload credentials');
        }

        await uploadFileToBunny(resume, resumeUploadUrl, resumeAccessKey);
        resumeCdnUrl = resumeUrl;
      }

      // Save video details to database
      await saveVideoDetails({
        videoId,
        thumbnailUrl: thumbnailCdnUrl,
        resumeUrl: resumeCdnUrl,
        ...formData,
      });

      // Redirect to video page on success
      router.push(`/video/${videoId}`);
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Video</CardTitle>
          <CardDescription>
            Upload your video file here. Supported formats: MP4, MOV, AVI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter video title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter video description"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Enter tags (comma separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={formData.visibility}
                onValueChange={handleVisibilityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="cursor-pointer"
              />
              {thumbnailPreview && (
                <div className="mt-2 relative w-full aspect-video">
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">Resume (PDF)</Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleResumeChange}
                className="cursor-pointer"
              />
              {resume && (
                <p className="text-sm text-muted-foreground">
                  Selected resume: {resume.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="video">Video File</Label>
              <Input
                ref={fileInputRef}
                id="video"
                type="file"
                accept="video/mp4,video/mov,video/avi"
                onChange={handleFileChange}
                className="cursor-pointer"
                required
              />
              {uploadFile && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {uploadFile.name}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!uploadFile || !formData.title || isUploading}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
