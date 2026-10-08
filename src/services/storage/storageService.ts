import { Evidence } from '../../types';
import { auth } from '../../lib/firebase';

export interface UploadEvidenceOptions {
  file: File;
  reportId: string;
  uploadedBy: string;
  onProgress?: (progress: number) => void;
}

export interface StorageProvider {
  uploadEvidence(options: UploadEvidenceOptions): Promise<Evidence>;
  getEvidence(evidenceId: string): Promise<{ url: string; metadata: Evidence }>;
  getEvidenceMetadata(evidenceId: string): Promise<Evidence>;
  deleteEvidence(evidenceId: string): Promise<boolean>;
  isConfigured(): Promise<boolean>;
}

export class TelegramStorageProvider implements StorageProvider {
  private apiBase = '/api/evidence';

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const user = auth?.currentUser;
    if (!user) throw new Error('আপনাকে প্রথমে লগইন করতে হবে।');
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }

  async isConfigured(): Promise<boolean> {
    try {
      const res = await fetch(`${this.apiBase}/status`, { headers: await this.getAuthHeaders() });
      if (!res.ok) return false;
      const data = await res.json();
      return Boolean(data.telegramConfigured);
    } catch {
      return false;
    }
  }

  async uploadEvidence(options: UploadEvidenceOptions): Promise<Evidence> {
    const { file, reportId, uploadedBy, onProgress } = options;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('reportId', reportId);
    formData.append('uploadedBy', uploadedBy);

    // Call secure backend
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.open('POST', `${this.apiBase}/upload`);

      void this.getAuthHeaders().then((headers) => {
        Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
        xhr.send(formData);
      }).catch(reject);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.evidence);
          } catch (e) {
            reject(new Error('Invalid response from evidence storage server'));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.error || 'Failed to upload evidence to Telegram channel'));
          } catch {
            reject(new Error(`Evidence upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during secure evidence upload'));
      };

    });
  }

  async getEvidence(evidenceId: string): Promise<{ url: string; metadata: Evidence }> {
    const res = await fetch(`${this.apiBase}/${evidenceId}`, { headers: await this.getAuthHeaders() });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to retrieve evidence');
    }
    const data = await res.json();
    return {
      url: data.streamUrl || `${this.apiBase}/${evidenceId}/stream`,
      metadata: data.evidence,
    };
  }

  async getEvidenceMetadata(evidenceId: string): Promise<Evidence> {
    const res = await fetch(`${this.apiBase}/${evidenceId}/metadata`, { headers: await this.getAuthHeaders() });
    if (!res.ok) {
      throw new Error('Failed to retrieve evidence metadata');
    }
    const data = await res.json();
    return data.evidence;
  }

  async deleteEvidence(evidenceId: string): Promise<boolean> {
    const res = await fetch(`${this.apiBase}/${evidenceId}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    return res.ok;
  }
}

export const storageService = new TelegramStorageProvider();
export default storageService;
