import apiClient from "./apiClient";

// Uploads are referenced inconsistently across collections ("uploads/foo.png"
// for users and press releases, bare "foo.png" for top-up screenshots), and the
// API keys off the filename alone.
export const toFileName = (filePath) => {
  if (!filePath) return "";
  return String(filePath).split("/").pop().split("\\").pop();
};

// Files sit behind an authenticated route, so they cannot be loaded by pointing
// an <img> at a URL; they are fetched with the bearer token and wrapped in an
// object URL instead. Callers are responsible for revoking the result.
export const fetchFileObjectUrl = async (filePath) => {
  const fileName = toFileName(filePath);
  if (!fileName) throw new Error("Missing file path");

  const response = await apiClient.get(`/files/${encodeURIComponent(fileName)}`, {
    responseType: "blob",
  });

  return URL.createObjectURL(response.data);
};
