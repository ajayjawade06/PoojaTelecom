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

  // Handle raw filenames that might be missing the /api/upload/image/ prefix
  let formattedPath = imagePath;
  if (imagePath.startsWith('image-')) {
    formattedPath = `/api/upload/image/${imagePath}`;
  }

  // If it's a backend relative path, use BASE_URL (which is emptystring on production for proxying)
  if (formattedPath.startsWith('/api/upload') || formattedPath.startsWith('/uploads')) {
    const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    return `${baseUrl}${formattedPath}`;
  }

  // Return as is (could be a local public folder asset or already correctly formatted)
  return formattedPath;
};
