import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import {
  ClickAwayListener,
  makeStyles,
  Popper,
  Tooltip
} from '@material-ui/core'

import classNames from 'classnames'
import { get } from 'lodash'

import { EditorState, Modifier, SelectionState } from 'draft-js'
import { mdiAlertOutline } from '@mdi/js'

import { useMenu } from 'hooks/use-menu'

import { defaultTemplateVariableSuggestions } from 'components/EmailCompose/default-template-variable-suggestions'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { ITemplateVariableSuggestion } from 'components/TemplateVariablesButton'

import { expressionRegExp } from '../expression-regexp'
import { TemplateExpressionPopover } from '../TemplateExpressionPopover'
import { DraftPluginEditorInlineDecoratorProps } from '../../../../types'

import { styles } from './styles'
import { TemplateExpressionContext } from '../template-expression-context'

const useTemplateExpressionStyles = makeStyles(styles)

interface Props extends DraftPluginEditorInlineDecoratorProps {
  decoratedText: string
}

/**
 * Props to be passed to an element within the editor which is supposed to
 * handle keyboard and/or mouse events. These events are by default propagated
 * into the editor which results in unexpected behavior.
 */
const preventEditorEventsProps = [
  'onKeyDown',
  'onKeyUp',
  'onKeyPress',
  'onMouseUp',
  'onMouseDown',
  'onFocus',
  'onBlur',
  'onSelect',
  'onInput',
  'onBeforeInput',
  'onPaste',
  'onCompositionStart',
  'onCompositionUpdate',
  'onCompositionEnd'
].reduce((props, eventName) => {
  props[eventName] = e => e.stopPropagation()

  return props
}, {})

export const TemplateExpression = ({
  decoratedText,
  setEditorState,
  getEditorState,
  offsetKey,
  ...props
}: Props) => {
  const classes = useTemplateExpressionStyles()

  const [, expression = '', ...rest] =
    new RegExp(expressionRegExp).exec(decoratedText) || []
  const fallback = rest[rest.length - 1] || ''

  const fallbackPopover = useMenu({
    id: 'template-expression-fallback'
  })

  const expressionContext = useContext(TemplateExpressionContext)

  const value =
    expressionContext &&
    // The following line is necessary in some cases! please don't remove it! :D
    get(expressionContext, expression.split('.')[0]) &&
    (get(expressionContext, expression) || fallback)

  const suggestion = getSuggestion(expression)
  const expressionText = suggestion ? suggestion.title : expression
  const noValue = !value && !fallback

  const icon = noValue ? (
    <ExpressionIcon />
  ) : (
    <SvgIcon path={mdiAlertOutline} className={classes.icon} />
  )

  const setFallback = (newFallback: string) => {
    const { block, start } = props.children[0].props

    const newContentState = Modifier.replaceText(
      getEditorState().getCurrentContent(),
      SelectionState.createEmpty(block.getKey()).merge({
        anchorOffset: start,
        focusOffset: start + decoratedText.length
      }) as SelectionState,
      `{{ ${expression} or "${newFallback.replace('"', '\\"')}"}}`
    )

    setEditorState(
      EditorState.set(getEditorState(), { currentContent: newContentState })
    )
  }

  const onSubmit = () => {
    fallbackPopover.onClose()

    const { block, start } = props.children[0].props
    const end = start + decoratedText.length
    // If expression is the latest thing in the block, putting focus to right
    // after it (end of the block) doesn't work for some reason.
    // We fallback to putting focus before the expression in this case.
    const offset = end < block.getLength() ? end : start

    const newSelection = SelectionState.createEmpty(block.getKey()).merge({
      anchorOffset: offset,
      focusOffset: offset,
      hasFocus: true
    })

    setEditorState(
      EditorState.forceSelection(
        getEditorState(),
        newSelection as SelectionState
      )
    )
  }
  const [tooltipOpen, setTooltipOpen] = useState(false)

  // Whenever the value of the expression is changed, we flash the tooltip
  // for a short period in order to let the user notice the changes.
  useEffect(() => {
    if (value) {
      setTooltipOpen(true)

      const timer = setTimeout(() => {
        setTooltipOpen(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [value])

  return (
    <Tooltip
      title={value || ''}
      placement="top"
      open={tooltipOpen && value && !fallbackPopover.open}
      classes={{ tooltip: classes.tooltip }}
      onClose={() => setTooltipOpen(false)}
      onOpen={() => setTooltipOpen(true)}
    >
      <span
        {...fallbackPopover.elementTriggerProps}
        {...preventEditorEventsProps}
        onClick={fallbackPopover.elementTriggerProps.onClick}
        contentEditable={false}
        className={classNames(classes.root, {
          [classes.noFallback]: noValue
        })}
      >
        &nbsp;{icon}
        {/* NOTE: using padding doesn't work here as expected.
      It causes cursor to enter the expression area */}
        {expressionText}&nbsp;
        <ClickAwayListener {...fallbackPopover.clickAwayListenerProps}>
          <Popper
            anchorEl={fallbackPopover.triggerRef.current}
            style={{ zIndex: fallbackPopover.zIndex }}
            open={fallbackPopover.open}
            placement="top"
            // We need to stop propagation to prevent the event to be caught by
            // the editor.
          >
            <TemplateExpressionPopover
              onClick={e => e.stopPropagation()}
              fallback={fallback}
              suggestion={suggestion}
              onSubmit={onSubmit}
              onFallbackChange={setFallback}
              expressionText={expressionText}
            />
          </Popper>
        </ClickAwayListener>
      </span>
    </Tooltip>
  )
}

const allSuggestions = defaultTemplateVariableSuggestions.flatMap(
  group => group.suggestions
)

/**
 * Temporary solution until Ali gives icon for template expressions
 * @constructor
 */
function ExpressionIcon() {
  return (
    <span style={{ lineHeight: 0, fontSize: '1rem', fontFamily: 'Times' }}>
      ↭{' '}
    </span>
  )
}

function getSuggestion(
  expression: string
): ITemplateVariableSuggestion | undefined {
  return allSuggestions.find(suggestion => suggestion.expression === expression)
}
