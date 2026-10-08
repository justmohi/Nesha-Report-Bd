import { config } from '../config';

export interface TelegramUploadResult {
  messageId: number;
  fileId: string;
  fileType: string;
  channelId: string;
  caption?: string;
}

export class TelegramService {
  private botToken: string;
  private channelId: string;

  constructor() {
    this.botToken = config.telegramBotToken;
    this.channelId = config.telegramChannelId;
  }

  isConfigured(): boolean {
    return config.isTelegramConfigured;
  }

  private getApiUrl(method: string): string {
    return `https://api.telegram.org/bot${this.botToken}/${method}`;
  }

  async sendPhoto(fileBuffer: Buffer, fileName: string, caption?: string): Promise<TelegramUploadResult> {
    if (!this.isConfigured()) {
      throw new Error('Telegram storage is not configured yet.');
    }

    const formData = new FormData();
    formData.append('chat_id', this.channelId);
    const blob = new Blob([new Uint8Array(fileBuffer)], { type: 'image/jpeg' });
    formData.append('photo', blob, fileName);
    if (caption) formData.append('caption', caption);

    const res = await fetch(this.getApiUrl('sendPhoto'), {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!data.ok) {
      throw new Error(`Telegram API sendPhoto error: ${data.description || 'Unknown error'}`);
    }

    const photos = data.result.photo;
    const largestPhoto = photos[photos.length - 1];

    return {
      messageId: data.result.message_id,
      fileId: largestPhoto.file_id,
      fileType: 'image',
      channelId: this.channelId,
      caption,
    };
  }

  async sendVideo(fileBuffer: Buffer, fileName: string, mimeType: string, caption?: string): Promise<TelegramUploadResult> {
    if (!this.isConfigured()) {
      throw new Error('Telegram storage is not configured yet.');
    }

    const formData = new FormData();
    formData.append('chat_id', this.channelId);
    const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType || 'video/mp4' });
    formData.append('video', blob, fileName);
    if (caption) formData.append('caption', caption);

    const res = await fetch(this.getApiUrl('sendVideo'), {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!data.ok) {
      throw new Error(`Telegram API sendVideo error: ${data.description || 'Unknown error'}`);
    }

    return {
      messageId: data.result.message_id,
      fileId: data.result.video.file_id,
      fileType: 'video',
      channelId: this.channelId,
      caption,
    };
  }

  async sendDocument(fileBuffer: Buffer, fileName: string, mimeType: string, caption?: string): Promise<TelegramUploadResult> {
    if (!this.isConfigured()) {
      throw new Error('Telegram storage is not configured yet.');
    }

    const formData = new FormData();
    formData.append('chat_id', this.channelId);
    const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType || 'application/octet-stream' });
    formData.append('document', blob, fileName);
    if (caption) formData.append('caption', caption);

    const res = await fetch(this.getApiUrl('sendDocument'), {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!data.ok) {
      throw new Error(`Telegram API sendDocument error: ${data.description || 'Unknown error'}`);
    }

    return {
      messageId: data.result.message_id,
      fileId: data.result.document.file_id,
      fileType: 'document',
      channelId: this.channelId,
      caption,
    };
  }

  async getFile(fileId: string): Promise<{ filePath: string; streamUrl: string }> {
    if (!this.isConfigured()) {
      throw new Error('Telegram storage is not configured yet.');
    }

    const res = await fetch(`${this.getApiUrl('getFile')}?file_id=${fileId}`);
    const data = await res.json();

    if (!data.ok || !data.result.file_path) {
      throw new Error(`Telegram getFile error: ${data.description || 'Could not locate file path'}`);
    }

    const filePath = data.result.file_path;
    const streamUrl = `https://api.telegram.org/file/bot${this.botToken}/${filePath}`;
    return { filePath, streamUrl };
  }

  async deleteMessage(messageId: number): Promise<boolean> {
    if (!this.isConfigured()) {
      throw new Error('Telegram storage is not configured yet.');
    }

    const res = await fetch(this.getApiUrl('deleteMessage'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: this.channelId,
        message_id: messageId,
      }),
    });

    const data = await res.json();
    return Boolean(data.ok);
  }
}

export const telegramService = new TelegramService();
export default telegramService;
