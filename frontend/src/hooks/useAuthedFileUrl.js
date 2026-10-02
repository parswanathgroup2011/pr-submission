import { useEffect, useState } from "react";
import { fetchFileObjectUrl } from "../services/fileApi";

// Returns a blob URL for a protected upload, or "" while loading or on failure.
export default function useAuthedFileUrl(filePath) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!filePath) {
      setUrl("");
      return undefined;
    }

    let active = true;
    let objectUrl = "";

    fetchFileObjectUrl(filePath)
      .then((next) => {
        if (!active) {
          URL.revokeObjectURL(next);
          return;
        }
        objectUrl = next;
        setUrl(next);
      })
      .catch(() => {
        if (active) setUrl("");
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [filePath]);

  return url;
}
