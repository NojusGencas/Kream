/** API base without trailing slash or /api suffix (Render serves /categories not /api/categories) */
export const API_URL = (import.meta.env.VITE_API_URL || 'https://api-rjrt.onrender.com')
  .replace(/\/+$/, '')
  .replace(/\/api$/i, '');

export const getApiUrl = (endpoint) => {
  if (!endpoint) return API_URL;

  if (/^https?:\/\//i.test(endpoint)) {
    if (endpoint.startsWith('http://localhost:3000')) {
      return endpoint.replace('http://localhost:3000', API_URL);
    }
    return endpoint;
  }

  let path = String(endpoint).replace(/^\/api/, '');
  if (!path.startsWith('/')) path = `/${path}`;
  const result = `${API_URL}${path}`;

  // #region agent log
  fetch('http://127.0.0.1:7629/ingest/bdf171ee-e641-45e8-80db-cc12fa2b804f',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7e2fdd'},body:JSON.stringify({sessionId:'7e2fdd',runId:'post-fix',location:'config.js:getApiUrl',message:'getApiUrl',data:{endpoint,result,apiUrl:API_URL},timestamp:Date.now(),hypothesisId:'H1-H3'})}).catch(()=>{});
  // #endregion

  return result;
};

/** Build full URL for a product image from API fields */
export function resolveProductImage(mainImage, slug) {
  if (mainImage?.startsWith('http')) return mainImage;
  const path = mainImage
    ? (mainImage.startsWith('/') ? mainImage : `/img/products/${mainImage}`)
    : `/img/products/${slug}.jpg`;
  return getApiUrl(path);
}

/** Normalize relative image path from DB to full API URL */
export function resolveImagePath(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  let path = imagePath;
  if (path.startsWith('img/')) path = `/${path}`;
  else if (!path.startsWith('/')) path = `/img/products/${path}`;
  return getApiUrl(path);
}
