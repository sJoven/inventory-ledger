export function validateStoreName(storeName?: string) {
  if (!storeName || storeName.trim() === "") {
    return { success: false, error: "Store name is required." };
  }
  return { success: true };
}
