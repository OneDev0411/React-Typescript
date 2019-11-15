declare module 'draft-js-plugins-editor' {
  import {
    ContentBlock,
    ContentState,
    Editor as DraftEditor,
    EditorState,
    EditorProps
  } from 'draft-js'
  import * as React from 'react'

  /**
   * importing DraftDecorator from draftjs types doesn't work for some reason
   */
  interface DraftDecorator {
    strategy: (
      block: ContentBlock,
      callback: (start: number, end: number) => void,
      contentState: ContentState
    ) => void
    component: Function
    props?: Object
  }

  interface PluginEditorProps extends EditorProps {
    plugins: DraftJsPlugin[]
  }

  export default class Editor extends React.Component<PluginEditorProps, {}> {
    getEditorState(): EditorState

    editor: DraftEditor

    plugins: DraftJsPlugin[]

    focus()
  }

  export interface PluginFunctions {
    getPlugins(): any[]
    getProps: any[]
    setEditorState(editorState: EditorState): void
    getEditorState(): EditorState
    getReadOnly(): boolean
    setReadOnly(readonly: boolean): void
    getEditorRef(): DraftEditor
  }

  export interface DraftJsPlugin {
    initialize?: (fns: PluginFunctions) => void
    onChange?: (editorState: EditorState, fns: PluginFunctions) => EditorState
    willUnmount?: (fns: PluginFunctions) => void
    decorators?: Array<DraftDecorator>
    getAccessibilityProps?: () => { ariaHasPopup: string; ariaExpanded: string }
    handleBeforeInput?: AugmentParam2<
      EditorProps['handleBeforeInput'],
      PluginFunctions
    >
    handlePastedFiles?: AugmentParam1<
      EditorProps['handlePastedFiles'],
      PluginFunctions
    >
    handlePastedText?: AugmentParam3<
      EditorProps['handlePastedText'],
      PluginFunctions
    >
    handleKeyCommand?: AugmentParam2<
      EditorProps['handleKeyCommand'],
      PluginFunctions
    >
    handleReturn?: AugmentParam2<EditorProps['handleReturn'], PluginFunctions>
    keyBindingFn?: PluginFnHook<EditorProps['keyBindingFn']>
    [key: string]: any
  }
  export function composeDecorators(...decorators: any[]): any

  type AugmentPluginFunctions<T> = AugmentParam<T, PluginFunctions>

  type PluginFnHook<F extends (...args: any[]) => any> = F extends (
    ...args: infer Args
  ) => infer R
    ? (...args: Args) => Exclude<R | undefined, null>
    : never

  // from https://stackoverflow.com/a/58715632/1493081
  type Cons<H, T extends any[]> = ((h: H, ...t: T) => void) extends ((
    ...r: infer R
  ) => void)
    ? R
    : never

  type Push<T extends any[], V> = Cons<any, T> extends infer A
    ? { [K in keyof A]: K extends keyof T ? T[K] : V }
    : never

  type AugmentParam<F extends (...args: any[]) => any, ExtraParam> = (
    ...args: Extract<Push<Parameters<F>, ExtraParam>, any[]>
  ) => ReturnType<F>
  // //// but this general AugmentParam seems not working yet. maybe ts version

  type AugmentParam1<
    F extends (...args: any[]) => any,
    ExtraParam
  > = F extends (...args: infer Args) => infer R
    ? (
        ...args: [
          Args[0] /* Spread doesn't work here, so it doesn't work for arbitrary number of arguments :( */,
          ExtraParam
        ]
      ) => R
    : never
  type AugmentParam2<
    F extends (...args: any[]) => any,
    ExtraParam
  > = F extends (...args: infer Args) => infer R
    ? (
        ...args: [
          Args[0],
          Args[1] /* Spread doesn't work here, so it doesn't work for arbitrary number of arguments :( */,
          ExtraParam
        ]
      ) => R
    : never
  type AugmentParam3<
    F extends (...args: any[]) => any,
    ExtraParam
  > = F extends (...args: infer Args) => infer R
    ? (
        ...args: [
          Args[0],
          Args[1],
          Args[2] /* Spread doesn't work here, so it doesn't work for arbitrary number of arguments :( */,
          ExtraParam
        ]
      ) => R
    : never
}
