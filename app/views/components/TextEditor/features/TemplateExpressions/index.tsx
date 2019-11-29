import React from 'react'

import { useEditorPlugins } from '../../hooks/use-editor-plugins'
import createTemplateExpressionsPlugin from './template-expressions-plugin'
import {
  ITemplateVariableSuggestion,
  ITemplateVariableSuggestionGroup,
  TemplateVariablesButton
} from '../../../TemplateVariablesButton'
import { insertTemplateVariable } from '../../modifiers/insert-template-expression'
import { ToolbarFragment } from '../../components/ToolbarFragment'
import { useEditor } from '../../hooks/use-editor'

interface Props {
  templateVariableSuggestionGroups: ITemplateVariableSuggestionGroup[]
}

export function TemplateExpressionsFeature({
  templateVariableSuggestionGroups
}: Props) {
  useEditorPlugins(
    () => ({
      templateExpressions: createTemplateExpressionsPlugin()
    }),
    []
  )

  const { setEditorState, editorState } = useEditor()
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
    <ToolbarFragment group="templateExpressions">
      <TemplateVariablesButton
        suggestions={templateVariableSuggestionGroups || []}
        onSuggestionSelected={suggestion => insertVariable(suggestion)}
      />
    </ToolbarFragment>
  )
}
