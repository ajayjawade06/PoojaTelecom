import { BASE_URL } from '../constants';

/**
 * Ensures that an image path is resolved to a full URL pointing to the backend
 * if it's a relative path starting with /api/upload or /uploads.
 * 
 * @param {string} imagePath - The path or URL of the image
 * @returns {string} - The full URL to the image
 */
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return '';

  // If it's already an absolute URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If it's a backend relative path, prepend the BASE_URL
  if (imagePath.startsWith('/api/upload') || imagePath.startsWith('/uploads')) {
    // Ensure we don't have double slashes if BASE_URL ends with a slash
    const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    return `${baseUrl}${imagePath}`;
  }

  // Return as is (could be a local public folder asset)
  return imagePath;
};
