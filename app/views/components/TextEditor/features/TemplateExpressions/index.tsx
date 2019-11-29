import React, { useContext } from 'react'

import { useEditorPlugin } from '../../hooks/use-editor-plugin'
import createTemplateExpressionsPlugin from '../../plugins/template-expressions-plugin'
import {
  ITemplateVariableSuggestion,
  ITemplateVariableSuggestionGroup,
  TemplateVariablesButton
} from '../../../TemplateVariablesButton'
import { Separator } from '../../styled'
import { insertTemplateVariable } from '../../modifiers/insert-template-expression'
import { EditorContext } from '../../index'
import { ToolbarFragment } from '../../components/ToolbarFragment'

interface Props {
  templateVariableSuggestionGroups: ITemplateVariableSuggestionGroup[]
}

export function TemplateExpressionsFeature({
  templateVariableSuggestionGroups
}: Props) {
  useEditorPlugin(createTemplateExpressionsPlugin, [])

  const { setEditorState, getEditorState } = useContext(EditorContext)
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
