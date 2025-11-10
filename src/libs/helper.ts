export const getErrorMsg = (e: any) => {
  const msg =
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    "Terjadi kesalahan. Coba lagi.";
  return typeof msg === "string" ? msg : JSON.stringify(msg);
};
