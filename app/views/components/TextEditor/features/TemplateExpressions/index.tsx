import React from 'react'

import { useEditorPlugin } from '../../hooks/use-editor-plugin'
import createTemplateExpressionsPlugin from '../../plugins/template-expressions-plugin'
import {
  ITemplateVariableSuggestion,
  ITemplateVariableSuggestionGroup,
  TemplateVariablesButton
} from '../../../TemplateVariablesButton'
import { Separator } from '../../styled'
import { insertTemplateVariable } from '../../modifiers/insert-template-expression'
import { ToolbarFragment } from '../../components/ToolbarFragment'
import { useEditor } from '../../hooks/use-editor'

interface Props {
  templateVariableSuggestionGroups: ITemplateVariableSuggestionGroup[]
}

export function TemplateExpressionsFeature({
  templateVariableSuggestionGroups
}: Props) {
  useEditorPlugin(createTemplateExpressionsPlugin, [])

  const { setEditorState, getEditorState } = useEditor()
  const insertVariable = (suggestion: ITemplateVariableSuggestion) => {
    const editorState = getEditorState()

    if (editorState) {
      setEditorState(
        insertTemplateVariable(
          editorState,
          suggestion.expression,
          suggestion.defaultFallback
        )
      )
    }
  }

  return (
    <ToolbarFragment group="templateExpressions">
      <TemplateVariablesButton
        suggestions={templateVariableSuggestionGroups || []}
        onSuggestionSelected={suggestion => insertVariable(suggestion)}
      />
      <Separator />
    </ToolbarFragment>
  )
}
