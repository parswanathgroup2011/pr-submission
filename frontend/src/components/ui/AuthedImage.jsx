import { Box } from "@mui/material";
import useAuthedFileUrl from "../../hooks/useAuthedFileUrl";

// Renders an upload that lives behind the authenticated /api/files route.
export default function AuthedImage({ filePath, alt, fallback = null, ...props }) {
  const src = useAuthedFileUrl(filePath);

  if (!src) return fallback;

  return <Box component="img" src={src} alt={alt} {...props} />;
}
