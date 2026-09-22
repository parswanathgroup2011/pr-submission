import React, { useEffect } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  RichTextEditorProvider,
  RichTextField,
  MenuControlsContainer,
  MenuSelectHeading,
  MenuDivider,
  MenuButtonBold,
  MenuButtonItalic,
} from 'mui-tiptap';

export default function MuiRichText({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    const next = value || "";
    if (editor.getHTML() !== next) {
      editor.commands.setContent(next, false);
    }
  }, [editor, value]);

  return (
    <RichTextEditorProvider editor={editor}>
      <RichTextField
        controls={
          <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
          </MenuControlsContainer>
        }
        editable
        sx={{
          minHeight: 300,
          border: "1px solid",
          borderColor: "divider",
          padding: 2,
          borderRadius: 1,
          backgroundColor: "background.paper",
          overflowY: "auto",
        }}
      />
    </RichTextEditorProvider>
  );
}
