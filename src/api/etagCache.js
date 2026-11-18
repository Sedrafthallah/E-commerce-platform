import { TOKEN_KEY } from "@/constants/storage";

const cache = new Map();

export const getWithETag = async (api, url, config = {}) => {
  const token = localStorage.getItem(TOKEN_KEY) || "";

  // مفتاح مستقل لكل طلب حسب الرابط والفلاتر والمستخدم
  const cacheKey = JSON.stringify({
    url,
    params: config.params || {},
    token,
  });

  const cached = cache.get(cacheKey);

  const requestConfig = {
    ...config,
    headers: { ...config.headers },
    validateStatus: (status) =>
      (status >= 200 && status < 300) || status === 304,
  };

  // إذا عندنا ETag سابق، نرسله للباك
  if (cached?.etag) {
    requestConfig.headers["If-None-Match"] = cached.etag;
  }

  const response = await api.get(url, requestConfig);
  console.log("ETag response:", response.headers.etag);
  console.log("Request headers:", requestConfig.headers);
  console.log("Response status:", response.status);
  console.log("Cached before request:", cached);

  // البيانات لم تتغير
  if (response.status === 304) {
    if (cached) {
      return {
        ...response,
        data: cached.data,
      };
    }

    // إذا وصل 304 وما عندنا نسخة مخزنة، نعيد الطلب بدون ETag
    return api.get(url, config);
  }

  // تخزين البيانات والـ ETag الجديد
  cache.set(cacheKey, {
    data: response.data,
    etag: response.headers.etag,
  });

  return response;
};

export const clearETagCache = () => {
  cache.clear();
};
