import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { ValidationError, NotFoundError } from '../../common/errors';
import { auditService } from '../audit/audit.service';

const ALLOWED_MIME_TYPES: Record<string, { type: 'IMAGE' | 'AUDIO' | 'DOCUMENT' | 'VIDEO' | 'OTHER'; maxSize: number }> = {
  'image/jpeg': { type: 'IMAGE', maxSize: 10 * 1024 * 1024 },
  'image/png': { type: 'IMAGE', maxSize: 10 * 1024 * 1024 },
  'image/webp': { type: 'IMAGE', maxSize: 10 * 1024 * 1024 },
  'image/gif': { type: 'IMAGE', maxSize: 5 * 1024 * 1024 },
  'audio/mpeg': { type: 'AUDIO', maxSize: 25 * 1024 * 1024 },
  'audio/wav': { type: 'AUDIO', maxSize: 25 * 1024 * 1024 },
  'audio/ogg': { type: 'AUDIO', maxSize: 25 * 1024 * 1024 },
  'audio/webm': { type: 'AUDIO', maxSize: 25 * 1024 * 1024 },
  'application/pdf': { type: 'DOCUMENT', maxSize: 10 * 1024 * 1024 },
};

export interface CreateUploadIntentDto {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  isPublic?: boolean;
}

export const mediaService = {
  async createUploadIntent(dto: CreateUploadIntentDto, userId: string) {
    const allowed = ALLOWED_MIME_TYPES[dto.mimeType.toLowerCase()];
    if (!allowed) {
      throw new ValidationError(`Unsupported file type: ${dto.mimeType}. Allowed types: JPEG, PNG, WebP, GIF, MP3, WAV, OGG, WebM, PDF.`);
    }

    if (dto.sizeBytes > allowed.maxSize) {
      throw new ValidationError(`File exceeds maximum size limit of ${Math.round(allowed.maxSize / (1024 * 1024))}MB.`);
    }

    const key = `uploads/${userId}/${uuidv4()}-${dto.filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const uploadUrl = env.OBJECT_STORAGE_ENDPOINT
      ? `${env.OBJECT_STORAGE_ENDPOINT}/${env.OBJECT_STORAGE_BUCKET}/${key}`
      : `${env.API_BASE_URL}/api/v1/media/upload-mock/${encodeURIComponent(key)}`;

    const asset = await prisma.mediaAsset.create({
      data: {
        filename: dto.filename,
        mimeType: dto.mimeType,
        sizeBytes: dto.sizeBytes,
        type: allowed.type,
        url: uploadUrl,
        uploadedBy: userId,
        isPublic: dto.isPublic ?? false,
      },
    });

    await auditService.log({
      actorId: userId,
      action: 'MEDIA_UPLOAD_INTENT',
      resourceType: 'MediaAsset',
      resourceId: asset.id,
      metadata: { mimeType: dto.mimeType, sizeBytes: dto.sizeBytes },
    });

    return {
      assetId: asset.id,
      uploadUrl,
      key,
      expiresInSeconds: 900,
    };
  },

  async completeUpload(mediaId: string, userId: string) {
    const asset = await prisma.mediaAsset.findUnique({ where: { id: mediaId } });
    if (!asset) throw new NotFoundError('Media asset', mediaId);

    await auditService.log({
      actorId: userId,
      action: 'MEDIA_UPLOAD_COMPLETE',
      resourceType: 'MediaAsset',
      resourceId: mediaId,
    });

    return { asset, status: 'READY' };
  },
};

