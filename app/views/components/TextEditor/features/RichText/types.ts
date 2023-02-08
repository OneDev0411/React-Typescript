export interface RichTextFeatureProps {
  /**
   * Support for bold, italic and underline.
   * Defaults to true
   */
  inlineFormatting?: boolean
  /**
   * Support for links
   * Defaults to true
   */
  link?: boolean
  /**
   * Support for ordered and unordered lists
   * Defaults to true
   */
  lists?: boolean

  /**
   * Support for text size options
   * Default to true
   */
  textSize?: boolean
}
