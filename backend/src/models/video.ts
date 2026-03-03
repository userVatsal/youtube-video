export interface Video {
  id: string;
  userId: string;
  originalUrl: string;
  metadata: any;
  storagePath?: string;
  processedUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
