import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline } from '@tiptap/extension-underline';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Highlighter, 
  Palette,
  Undo,
  Redo,
  List,
  ListOrdered
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const colors = [
    { name: 'Default', value: 'inherit' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Black', value: '#1c1917' },
  ];

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-stone-50 border-b border-stone-200">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-stone-200 transition-colors ${editor.isActive('bold') ? 'bg-stone-200 text-[#ff533d]' : 'text-stone-600'}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-stone-200 transition-colors ${editor.isActive('italic') ? 'bg-stone-200 text-[#ff533d]' : 'text-stone-600'}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-stone-200 transition-colors ${editor.isActive('underline') ? 'bg-stone-200 text-[#ff533d]' : 'text-stone-600'}`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-stone-300 mx-1" />
        
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded hover:bg-stone-200 transition-colors ${editor.isActive('highlight') ? 'bg-stone-200 text-[#ff533d]' : 'text-stone-600'}`}
          title="Highlight"
        >
          <Highlighter className="w-4 h-4" />
        </button>

        <div className="relative group">
          <button
            className="p-2 rounded hover:bg-stone-200 transition-colors text-stone-600 flex items-center gap-1"
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
          </button>
          <div className="absolute top-full left-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-2xl p-3 hidden group-hover:grid grid-cols-4 gap-2 z-[60]">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => editor.chain().focus().setColor(c.value).run()}
                className="w-8 h-8 rounded-lg border border-stone-100 hover:scale-110 shadow-sm transition-transform"
                style={{ backgroundColor: c.value === 'inherit' ? 'transparent' : c.value }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div className="w-px h-4 bg-stone-300 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-stone-200 transition-colors ${editor.isActive('bulletList') ? 'bg-stone-200 text-[#ff533d]' : 'text-stone-600'}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-stone-200 transition-colors ${editor.isActive('orderedList') ? 'bg-stone-200 text-[#ff533d]' : 'text-stone-600'}`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="flex-1" />
        
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-stone-200 transition-colors text-stone-400 hover:text-stone-600"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-stone-200 transition-colors text-stone-400 hover:text-stone-600"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Surface */}
      <EditorContent 
        editor={editor} 
        className="p-6 min-h-[300px] max-h-[600px] overflow-y-auto prose prose-stone max-w-none focus:outline-none" 
      />
      
      <style>{`
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror p {
          margin: 0;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding: 0 1rem;
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
