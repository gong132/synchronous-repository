import * as React from 'react'

interface TinyEditor {
  height?: number,
  content?: string,
  disabled?: boolean,
  onContentChange: React.EventHandler<T>,
}

export default class TextEditor extends React.Component<TinyEditor, any> {}