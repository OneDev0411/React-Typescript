import React, { useContext } from 'react'

import {
  ITemplateVariableSuggestion,
  TemplateVariablesButton
} from '../../../TemplateVariablesButton'
import { ToolbarFragment } from '../../components/ToolbarFragment'
import { EditorContext } from '../../editor-context'
import { useEditorPlugins } from '../../hooks/use-editor-plugins'

import { insertTemplateVariable } from './modifiers/insert-template-expression'
import createTemplateExpressionsPlugin from './template-expressions-plugin'
import { TemplateExpressionsFeatureProps } from './types'

export function TemplateExpressionsFeature({
  templateVariableSuggestionGroups,
  showInToolbar = true
}: TemplateExpressionsFeatureProps) {
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
