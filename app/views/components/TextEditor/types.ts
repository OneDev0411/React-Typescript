import { FieldProps } from 'react-final-form'
import { CSSProperties, ReactElement, ReactNode, Ref } from 'react'

import { ContentBlock, ContentState, EditorProps, EditorState } from 'draft-js'

import { ClassesProps } from 'utils/ts-utils'

import { ITemplateVariableSuggestionGroup } from '../TemplateVariablesButton/types'
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
  className?: string
  defaultValue?: string
  input?: FieldProps<any>['input']
  onChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string

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
  /**
   * an optional function to be used when enableImage is true and an image is
   * added to the editor. It should upload the image and return the promise
   * of the uploaded image url. The src of the image in the editor will be
   * uploaded to that uploaded image url.
   * @param file
   */
  uploadImage?: (file: File) => Promise<string>

  /**
   * Signature content, used when enableSignature is true.
   * If string is passed, it's converted to ContentBlocks via stateFromHTML
   */
  signature?: ContentBlock[] | string

  /**
   * Callback to be called when signature doesn't exist and the user tries to
   * use it.
   */
  onEditSignature?: () => void

  /**
   * Whether to include signature by default or not
   */
  hasSignatureByDefault?: boolean

  onAttachmentDropped?: (file: File[]) => void

  /** ********
   * The following props are feature enabler flags.
   *
   * NOTE 1: They are meant to be constant props. You can't count on
   * changing them. and toggle features dynamically, on a mounted component
   *
   * NOTE 2: default value varies from one flag to another.
   ********* */

  /**
   * Enable/disable rich text editing features like bold, italic, lists, etc.
   */
  enableRichText?: boolean
  /**
   * Enable/disable image insertion.
   */
  enableImage?: boolean
  /**
   * Enable/disable signature insertion.
   */
  enableSignature?: boolean

  enableTemplateVariables?: boolean
  templateVariableSuggestionGroups?: ITemplateVariableSuggestionGroup[]

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
