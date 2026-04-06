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

  // Clean the path
  let path = imagePath.trim();

  // If it's already an absolute URL, return as is
  if (path.startsWith('http')) {
    return path;
  }

  // Remove leading slash for consistency during processing
  if (path.startsWith('/')) {
    path = path.slice(1);
  }

  // Handle various relative formats
  let formattedPath = path;

  // Case 1: Just a filename (e.g., 'image-123.jpg')
  if (path.startsWith('image-')) {
    formattedPath = `api/upload/image/${path}`;
  } 
  // Case 2: Legacy local path (e.g., 'uploads/image-123.jpg')
  else if (path.startsWith('uploads/image-')) {
    const filename = path.replace('uploads/', '');
    formattedPath = `api/upload/image/${filename}`;
  }
  // Case 3: Partial GridFS path (e.g., 'upload/image/image-123.jpg')
  else if (path.startsWith('upload/image/')) {
    formattedPath = `api/${path}`;
  }

  // Ensure it starts with a leading slash for the final resolution
  if (!formattedPath.startsWith('/')) {
    formattedPath = `/${formattedPath}`;
  }

  // Resolve with BASE_URL (empty string in production for Vercel rewrites)
  if (formattedPath.startsWith('/api/upload') || formattedPath.startsWith('/uploads')) {
    const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    return `${baseUrl}${formattedPath}`;
  }

  return formattedPath;
};
