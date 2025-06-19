// useFilePicker.ts
import { useRef } from "react";
import { Button, IconButton } from "@mui/material";
import AttachmentIcon from "@mui/icons-material/Attachment";

export function useFilePicker(onSelect: (files: FileList) => void) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const FileInput = (
    <>
      <Button variant="outlined" onClick={openFilePicker} fullWidth>
        <IconButton sx={{ color: "primary.main" }}>
          <AttachmentIcon />
        </IconButton>
        Upload
      </Button>
      <input
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files) {
            onSelect(e.target.files);
          }
        }}
      />
    </>
  );

  return { openFilePicker, FileInput };
}
