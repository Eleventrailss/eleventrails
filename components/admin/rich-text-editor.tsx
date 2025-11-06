"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder = "Masukkan jawaban" }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[100px] px-3 py-2 text-white bg-transparent',
      },
    },
  })

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="w-full bg-slate-700 border border-slate-600 rounded focus-within:border-[#EE6A28]">
      <div className="border-b border-slate-600 p-2 flex gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-sm transition-colors ${
            editor.isActive('bold')
              ? 'bg-[#EE6A28] text-white'
              : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
          }`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-sm transition-colors ${
            editor.isActive('italic')
              ? 'bg-[#EE6A28] text-white'
              : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
          }`}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded text-sm transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-[#EE6A28] text-white'
              : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
          }`}
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded text-sm transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-[#EE6A28] text-white'
              : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
          }`}
          title="Numbered List"
        >
          1.
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-2 py-1 rounded text-sm transition-colors ${
            editor.isActive('paragraph')
              ? 'bg-[#EE6A28] text-white'
              : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
          }`}
          title="Paragraph"
        >
          P
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded text-sm transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-[#EE6A28] text-white'
              : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
          }`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-sm transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-[#EE6A28] text-white'
              : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded text-sm transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-[#EE6A28] text-white'
              : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
          }`}
          title="Heading 3"
        >
          H3
        </button>
      </div>
      <EditorContent editor={editor} className="min-h-[100px] max-h-[300px] overflow-y-auto" />
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 100px;
          padding: 12px;
          color: #ffffff;
        }
        .ProseMirror p {
          margin: 0.5em 0;
          color: #ffffff;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
          color: #ffffff;
          list-style-position: outside;
        }
        .ProseMirror ul {
          list-style-type: disc;
        }
        .ProseMirror ol {
          list-style-type: decimal;
        }
        .ProseMirror li {
          color: #ffffff;
          display: list-item;
          margin: 0.25em 0;
        }
        .ProseMirror li::marker {
          color: #ffffff;
        }
        .ProseMirror h1 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
          color: #ffffff;
        }
        .ProseMirror h2 {
          font-size: 1.3em;
          font-weight: bold;
          margin: 0.5em 0;
          color: #ffffff;
        }
        .ProseMirror h3 {
          font-size: 1.1em;
          font-weight: bold;
          margin: 0.5em 0;
          color: #ffffff;
        }
        .ProseMirror strong {
          font-weight: bold;
          color: #ffffff;
        }
        .ProseMirror em {
          font-style: italic;
          color: #ffffff;
        }
        .ProseMirror u {
          text-decoration: underline;
          color: #ffffff;
        }
      `}</style>
    </div>
  )
}
