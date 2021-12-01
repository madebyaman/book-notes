import {useEditor, EditorContent} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {BsChatQuote, BsCode, BsCodeSquare, BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill, BsListOl, BsListUl, BsDash, BsTypeBold, BsTypeH1, BsTypeH2, BsTypeH3, BsTypeItalic} from "react-icons/bs"
import { Editor } from '@tiptap/core'

const MenuBar = ({ editor } : {editor: Editor | null}) => {
  if (!editor) {
    return null
  }

  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <BsTypeBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <BsTypeItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        <BsCode />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        <BsTypeH1 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        <BsTypeH2 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        <BsTypeH3 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <BsListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <BsListOl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        <BsCodeSquare />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        <BsChatQuote />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <BsDash />
      </button>
      <button onClick={() => editor.chain().focus().undo().run()}>
        <BsFillArrowLeftCircleFill />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()}>
        <BsFillArrowRightCircleFill />
      </button>
    </>
  )
}

const ContentEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit
    ],
    content: '<p>Hello world</p>'
  })

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default ContentEditor
