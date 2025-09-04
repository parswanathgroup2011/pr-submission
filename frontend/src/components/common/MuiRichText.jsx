import React from 'react';
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
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

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
          minHeight: 300,        // ⬅️ Increase this
          border: '1px solid #ccc',
          padding: 2,
          borderRadius: 2,
          backgroundColor: 'white',
          overflowY: 'auto'
        }}
      />
    </RichTextEditorProvider>
  );
}
