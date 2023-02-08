import { ITemplateVariableSuggestionGroup } from '../../../TemplateVariablesButton'

export interface TemplateExpressionsFeatureProps {
  /**
   * Suggestions for template expressions
   */
  templateVariableSuggestionGroups: ITemplateVariableSuggestionGroup[]
  /**
   * Weather to show variable insertion dropdown in the toolbar or not.
   * If set to false, expressions will bw shown as atomic pieces but there
   * is no UI in toolbar for adding more expressions.
   * Defaults to true
   */
  showInToolbar?: boolean
}
