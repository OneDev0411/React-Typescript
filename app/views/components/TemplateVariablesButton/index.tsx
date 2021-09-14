import * as React from 'react'

import {
  ClickAwayListener,
  Divider,
  List,
  ListItem,
  ListSubheader,
  Paper,
  Popper,
  useTheme
} from '@material-ui/core'

import { DropdownToggleButton } from '../DropdownToggleButton'
import {
  ITemplateVariableSuggestion,
  ITemplateVariableSuggestionGroup
} from '../TextEditor/features/TemplateExpressions/template-expressions-plugin/types'

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
        Placeholder Text
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
// eslint-disable-next-line max-len
export * from '../TextEditor/features/TemplateExpressions/template-expressions-plugin/types'
