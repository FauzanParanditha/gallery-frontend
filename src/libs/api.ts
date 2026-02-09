import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3333";

// ------- Buat instance dasar
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // <-- penting agar cookie access/refresh ikut dikirim
  timeout: 25000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ------- Refresh gate (hindari banyak refresh paralel)
let isRefreshing = false;
let pendingQueue: Array<(ok: boolean) => void> = [];

function waitForRefresh(): Promise<boolean> {
  if (!isRefreshing) return Promise.resolve(true);
  return new Promise((resolve) => pendingQueue.push(resolve));
}

function flushQueue(ok: boolean) {
  pendingQueue.forEach((res) => res(ok));
  pendingQueue = [];
}

// ------- (Opsional) sisipkan Authorization jika kamu juga simpan access di memory/browser
// Karena kamu pakai httpOnly cookie, bagian ini bisa di-skip.
// api.interceptors.request.use((config) => {
//   const token = yourAccessTokenStore.get(); // kalau ada
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// ------- Interceptor respon: auto-refresh saat 401
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status ?? 0;

    // kalau bukan 401 atau tidak ada config -> lempar
    if (!original || status !== 401) throw error;

    const url = (original.url || "").toString();
    // JANGAN refresh kalau 401-nya dari refresh atau login/me (opsional)
    if (url.includes("/auth")) {
      throw error;
    }

    // stop infinite retry
    if (original._retry) throw error;
    original._retry = true;

    // tunggu refresh yang sedang jalan
    const canProceed = await waitForRefresh();
    if (!canProceed) {
      handleAuthFailed();
      throw error;
    }

    try {
      if (!isRefreshing) {
        isRefreshing = true;

        // pakai instance TANPA interceptor untuk panggil refresh
        await axios.post(
          `${API_BASE_URL}/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        isRefreshing = false;
        flushQueue(true);
      }

      // ulangi request awal dengan cookie baru
      return api(original as AxiosRequestConfig);
    } catch (e) {
      isRefreshing = false;
      flushQueue(false);
      handleAuthFailed();
      throw e;
    }
  }
);

// ------- Helper saat refresh gagal
function handleAuthFailed() {
  // Bersihkan state lokal jika ada (store user, dsb)
  // yourAuthStore.clear();
  if (typeof window !== "undefined") {
    // Arahkan ke login (atau tampilkan toast)
    window.location.href = "/auth";
  }
}

export async function apiGet<T>(url: string, config?: AxiosRequestConfig) {
  const { data } = await api.get<T>(url, config);
  return data;
}
export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
) {
  const { data } = await api.post<T>(url, body, config);
  return data;
}
export async function apiPatch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
) {
  const { data } = await api.patch<T>(url, body, config);
  return data;
}
export async function apiDelete<T>(url: string, config?: AxiosRequestConfig) {
  const { data } = await api.delete<T>(url, config);
  return data;
}
