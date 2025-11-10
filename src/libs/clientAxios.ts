import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3333";

// ------- Buat instance dasar
export const clientAxios: AxiosInstance = axios.create({
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
// clientAxios.interceptors.request.use((config) => {
//   const token = yourAccessTokenStore.get(); // kalau ada
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// ------- Interceptor respon: auto-refresh saat 401
clientAxios.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Jika bukan 401 atau sudah pernah retry, lemparkan apa adanya
    if (!original || original._retry || error.response?.status !== 401) {
      throw error;
    }

    original._retry = true;

    // Antri kalau ada refresh yang sedang berjalan
    const canProceed = await waitForRefresh();
    if (!canProceed) {
      // refresh sebelumnya gagal, paksa logout
      handleAuthFailed();
      throw error;
    }

    try {
      if (!isRefreshing) {
        isRefreshing = true;
        // Panggil endpoint refresh kamu (samakan path-nya dengan server)
        await axios.post(
          `${API_BASE_URL}/auth/refresh`, // atau /v1/auth/refresh jika prefix v1
          {},
          { withCredentials: true }
        );
        isRefreshing = false;
        flushQueue(true);
      }

      // Setelah refresh sukses, ulangi request awal. Karena pakai cookie, tidak perlu set header apa pun.
      return clientAxios(original as AxiosRequestConfig);
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
  const { data } = await clientAxios.get<T>(url, config);
  return data;
}
export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
) {
  const { data } = await clientAxios.post<T>(url, body, config);
  return data;
}
export async function apiPatch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
) {
  const { data } = await clientAxios.patch<T>(url, body, config);
  return data;
}
export async function apiDelete<T>(url: string, config?: AxiosRequestConfig) {
  const { data } = await clientAxios.delete<T>(url, config);
  return data;
}
