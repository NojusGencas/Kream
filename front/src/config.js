function normalizeApiBase(url) {
  let base = String(url || 'https://api-rjrt.onrender.com').trim();
  if (!/^https?:\/\//i.test(base)) base = `https://${base}`;
  return base.replace(/\/+$/, '').replace(/\/api$/i, '');
}

/** API base without trailing slash or /api suffix (Render serves /categories not /api/categories) */
export const API_URL = normalizeApiBase(import.meta.env.VITE_API_URL);

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
  if (!result.includes('://') || /\.com[^/]/.test(result)) {
    fetch('http://127.0.0.1:7330/ingest/843a7127-9b3a-4140-a459-ab85c801be2f',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7e2fdd'},body:JSON.stringify({sessionId:'7e2fdd',runId:'post-fix',location:'config.js:getApiUrl',message:'invalid url built',data:{endpoint,result,apiUrl:API_URL},timestamp:Date.now(),hypothesisId:'H1-H3'})}).catch(()=>{});
  }
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
  path = path.replace(/^\/images\/products/, '/img/products');
  if (path.startsWith('img/')) path = `/${path}`;
  else if (!path.startsWith('/')) path = `/img/products/${path}`;
  return getApiUrl(path);
}
