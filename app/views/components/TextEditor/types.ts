import {
  ComponentProps,
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
  RefObject
} from 'react'
import Dropzone from 'react-dropzone'

import { ContentBlock, ContentState, EditorProps, EditorState } from 'draft-js'
import { Options as ExportOptions } from 'draft-js-export-html'
import { Options as ImportOptions } from 'draft-js-import-html'

import { DraftJsPlugin } from 'draft-js-plugins-editor'

import { Options } from 'draft-js-import-html'

import { ClassesProps } from 'utils/ts-utils'

import { styles } from './styles'
import { createEditorRef } from './create-editor-ref'

export interface ReferenceObject {
  clientHeight: number
  clientWidth: number

  getBoundingClientRect(): ClientRect
}

export type Entity = ReturnType<ContentState['getEntity']>

export type TextEditorRef = ReturnType<ReturnType<typeof createEditorRef>>

export interface TextEditorProps extends ClassesProps<typeof styles> {
  children?: ReactNode
  className?: string
  defaultValue?: string
  onChange?: (state: EditorState) => void
  disabled?: boolean
  placeholder?: string

  editorState: EditorState
  stateToHtmlOptions: ExportOptions
  stateFromHtmlOptions: ImportOptions

  /**
   * DraftJS [textAlignment](https://draftjs.org/docs/advanced-topics-text-direction#text-alignment)
   * prop
   */
  textAlignment?: 'left' | 'right' | 'center'

  toolbarRef?: Ref<HTMLDivElement>
  /**
   * minimum height of the editor area:
   * true: a reasonable min height will be applied
   * false: no minimum height
   * string | number: exact minimum height
   */
  minHeight?: boolean | CSSProperties['minHeight']
  style?: CSSProperties
  plugins?: any[]
  DraftEditorProps?: Omit<EditorProps, 'editorState' | 'onChange'>

  autofocus?: boolean

  onAttachmentDropped?: (file: File[]) => void

  appendix?: ReactNode
}

export interface AtomicBlockEntityData {
  alignment?: 'left' | 'right' | 'center' | 'default' // comes from alignment plugin
  width?: string // comes from block resizable plugin
  height?: string // comes from block resizable plugin
  src?: string // comes from image plugin
}

export interface DraftPluginEditorBlockDecoratorProps {
  block: ContentBlock
  blockProps: StringMap<any>
  contentState: ContentState
  className?: string
}

export interface DraftPluginEditorInlineDecoratorProps {
  contentState: ContentState
  dir: string | null
  entityKey: string | null
  getEditorState: () => EditorState
  offsetKey: string
  setEditorState: (editorState: EditorState) => void
  children: ReactElement<{
    start: number
    block: ContentBlock
  }>[]
}

export interface EditorContextApi {
  editorState: EditorState
  setEditorState: (newState: EditorState) => void
  stateFromHtmlOptions: Options
  editorRef: RefObject<DraftJsPlugin>
  /**
   * Adds a plugin and return a function which will remove this plugin.
   */
  addPlugins: (plugins: {
    [nameDraftJsPlugin: string]: DraftJsPlugin
  }) => () => void
  addDropzonePropsInterceptor: (interceptor) => () => void
}

export interface ToolbarFragment {
  group: string
  node: ReactNode
}

interface ToolbarSegmentApi {
  update: (node: ReactNode, group?: string) => void
  remove: () => void
}

export interface EditorToolbarContextApi {
  createToolbarFragment: () => ToolbarSegmentApi
}

export type DropzonePropsInterceptor = (
  props: ComponentProps<typeof Dropzone>
) => ComponentProps<typeof Dropzone>
