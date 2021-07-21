import React, { useContext } from 'react'

import {
  ITemplateVariableSuggestion,
  ITemplateVariableSuggestionGroup,
  TemplateVariablesButton
} from '../../../TemplateVariablesButton'
import { ToolbarFragment } from '../../components/ToolbarFragment'
import { EditorContext } from '../../editor-context'
import { useEditorPlugins } from '../../hooks/use-editor-plugins'

import { insertTemplateVariable } from './modifiers/insert-template-expression'
import createTemplateExpressionsPlugin from './template-expressions-plugin'

interface Props {
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

export function TemplateExpressionsFeature({
  templateVariableSuggestionGroups,
  showInToolbar = true
}: Props) {
  useEditorPlugins(
    () => ({
      templateExpressions: createTemplateExpressionsPlugin()
    }),
    []
  )

  const { setEditorState, editorState } = useContext(EditorContext)
  const insertVariable = (suggestion: ITemplateVariableSuggestion) => {
    setEditorState(
      insertTemplateVariable(
        editorState,
        suggestion.expression,
        suggestion.defaultFallback
      )
    )
  }

  return (
    <>
      {showInToolbar && (
        <ToolbarFragment group="templateExpressions">
          <TemplateVariablesButton
            suggestions={templateVariableSuggestionGroups || []}
            onSuggestionSelected={suggestion => insertVariable(suggestion)}
          />
        </ToolbarFragment>
      )}
    </>
  )
}
