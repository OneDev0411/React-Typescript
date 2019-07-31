export interface ITemplateVariableSuggestion {
  /**
   * Text to be displayed for this suggestion in suggestions menu
   */
  title: string
  /**
   * THe value to be inserted whenever it's selected. E.g. recipient.name
   */
  expression: string

  /**
   * Default value to be set as fallback when this suggestion is used
   */
  defaultFallback: string

  /**
   * A hint/description for the template variable. Not used in current design
   */
  description?: string
}

export interface ITemplateVariableSuggestionGroup {
  title: string
  suggestions: ITemplateVariableSuggestion[]
}
