import { memo } from 'react'

import { Popover, List, ListItem, ListItemText } from '@material-ui/core'

import { ViewType } from '../../types'

import { AVAILABLE_VIEWS } from './values'

interface Props {
  el: HTMLButtonElement | null
  selectedView: ViewType
  onChangeView(view: ViewType): void
  onClose(): void
}

const ChangeView = ({ el, selectedView, onClose, onChangeView }: Props) => {
  const open = Boolean(el)
  const id = open ? 'change-view-popover' : undefined

  const handleSelect = (values: ViewType) => {
    onChangeView(values)
    onClose()
  }

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={el}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <List disablePadding>
        {Object.keys(AVAILABLE_VIEWS).map((view: ViewType) => (
          <ListItem
            selected={selectedView === view}
            button
            onClick={() => {
              handleSelect(view)
            }}
            key={view}
          >
            <ListItemText>{AVAILABLE_VIEWS[view]}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Popover>
  )
}

export default memo(ChangeView)
