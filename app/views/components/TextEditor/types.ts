import { FieldProps } from 'react-final-form'
import { ContentBlock, ContentState, EditorProps } from 'draft-js'

import { ReactNode } from 'react'

import { ITemplateVariableSuggestionGroup } from '../TemplateVariablesButton/types'

export interface ReferenceObject {
  clientHeight: number
  clientWidth: number

  getBoundingClientRect(): ClientRect
}

export type Entity = ReturnType<ContentState['getEntity']>

export interface TextEditorProps {
  className?: string
  defaultValue?: string
  input?: FieldProps<any>['input']
  onChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string
  plugins?: any[]
  DraftEditorProps?: Omit<EditorProps, 'editorState' | 'onChange'>
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

  onAttachmentDropped?: (file: File) => void

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
