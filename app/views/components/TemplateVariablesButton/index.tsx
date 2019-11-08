import * as React from 'react'

import {
  ClickAwayListener,
  List,
  ListItem,
  ListSubheader,
  Paper,
  Popper,
  useTheme,
  Divider
} from '@material-ui/core'

import {
  ITemplateVariableSuggestion,
  ITemplateVariableSuggestionGroup
} from './types'
import { DropdownToggleButton } from '../DropdownToggleButton'

interface Props {
  suggestions: ITemplateVariableSuggestionGroup[]
  onSuggestionSelected?: (suggestion: ITemplateVariableSuggestion) => void
}

export function TemplateVariablesButton({
  onSuggestionSelected = () => {},
  ...props
}: Props) {
  const anchorRef = React.useRef<HTMLButtonElement>(null)
  const [open, setOpen] = React.useState(false)
  const theme = useTheme()

  const toggle = () => setOpen(open => !open)
  const select = suggestion => {
    onSuggestionSelected(suggestion)
    close()
  }
  const close = () => setOpen(false)

  return (
    <>
      <DropdownToggleButton
        isActive={open}
        ref={anchorRef}
        aria-controls="menu-list-grow"
        aria-haspopup="true"
        onClick={toggle}
      >
        Variable Text
      </DropdownToggleButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        transition
        style={{ zIndex: theme.zIndex.modal }}
        placement="bottom-start"
      >
        <Paper>
          <ClickAwayListener onClickAway={close}>
            <List
              innerRef={preventNativeMouseDownEventPropagation}
              style={{
                minWidth: '15rem',
                maxHeight: '25rem',
                overflow: 'auto'
              }}
            >
              {props.suggestions.map((group, index) => (
                <React.Fragment key={index}>
                  <ListSubheader disableSticky>{group.title}</ListSubheader>
                  {group.suggestions.map(suggestion => (
                    <ListItem
                      button
                      key={suggestion.expression}
                      onClick={() => select(suggestion)}
                    >
                      {suggestion.title}
                    </ListItem>
                  ))}
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  )
}

/**
 * This is done for when the editor is embedded inside Grape.js in MC
 * Preventing mousedown via react doesn't work as the handler in grape.js
 * is set up with pure DOM API.
 */
function preventNativeMouseDownEventPropagation(el: HTMLElement | null) {
  el &&
    el.addEventListener('mousedown', e => {
      e.stopPropagation()
    })
}
