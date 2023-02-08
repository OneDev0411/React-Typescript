import { ContentBlock } from 'draft-js'
import { Options as ExportOptions } from 'draft-js-import-html'

export interface SignatureFeatureProps {
  /**
   * Whether to include signature by default or not
   */
  hasSignatureByDefault?: boolean

  /**
   * Signature content.
   * If string is passed, it's converted to ContentBlocks via stateFromHTML
   */
  signature: ContentBlock[] | string

  /**
   * Callback to be called when signature doesn't exist and the user tries to
   * use it.
   */
  onEditSignature?: () => void

  stateFromHtmlOptions: ExportOptions
}
