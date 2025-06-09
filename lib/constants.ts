export const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
export const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024;

export const BUNNY = {
  STORAGE_BASE_URL: 'https://ny.storage.bunnycdn.com/vizume',
  CDN_URL: 'https://vizume.b-cdn.net',
  TRANSCRIPT_URL: 'https://vz-356d6b33-8d3.b-cdn.net',
  EMBED_URL: 'https://iframe.mediadelivery.net/embed',
  STREAM_BASE_URL: 'https://video.bunnycdn.com/library',
}

export const initialVideoState = {
  isLoaded: false,
  hasIncrementedView: false,
  isProcessing: true,
  processingProgress: 0,
};

export const infos = ["transcript", "metadata"];

export const DEFAULT_VIDEO_CONFIG = {
  width: { ideal: 1920 },
  height: { ideal: 1080 },
  frameRate: { ideal: 30 },
};

export const DEFAULT_RECORDING_CONFIG = {
  mimeType: "video/webm;codecs=vp9,opus",
  audioBitsPerSecond: 128000,
  videoBitsPerSecond: 2500000,
};

export const visibilities: Visibility[] = ["public", "private"];