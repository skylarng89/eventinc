// components/admin/RichTextEditor.vue

<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Link } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = new Editor({
  extensions: [StarterKit],
  content: props.modelValue,
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none'
    }
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

const buttons = [
  {
    icon: Bold,
    title: 'Bold',
    action: () => editor.chain().focus().toggleBold().run(),
    isActive: () => editor.isActive('bold')
  },
  {
    icon: Italic,
    title: 'Italic',
    action: () => editor.chain().focus().toggleItalic().run(),
    isActive: () => editor.isActive('italic')
  },
  {
    icon: List,
    title: 'Bullet List',
    action: () => editor.chain().focus().toggleBulletList().run(),
    isActive: () => editor.isActive('bulletList')
  },
  {
    icon: ListOrdered,
    title: 'Numbered List',
    action: () => editor.chain().focus().toggleOrderedList().run(),
    isActive: () => editor.isActive('orderedList')
  }
]
</script>

<template>
  <div class="border border-gray-300 rounded-md">
    <!-- Toolbar -->
    <div class="border-b border-gray-300 bg-gray-50 p-2 flex gap-1">
      <button
        v-for="button in buttons"
        :key="button.title"
        type="button"
        :title="button.title"
        class="p-1 rounded hover:bg-white"
        :class="{ 'bg-white text-indigo-600': button.isActive() }"
        @click="button.action"
      >
        <component :is="button.icon" class="w-5 h-5" />
      </button>
    </div>

    <!-- Editor Content -->
    <div class="p-4">
      <EditorContent
        :editor="editor"
        class="min-h-[200px] max-h-[500px] overflow-y-auto"
      />
    </div>
  </div>
</template>

<style>
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>