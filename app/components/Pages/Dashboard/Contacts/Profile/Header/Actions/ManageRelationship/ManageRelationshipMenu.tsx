import { useState } from 'react'

import { Divider, List, makeStyles, MenuItem, Popover } from '@material-ui/core'

import { frequencyOptions, frequencyToString } from './helper'
import { ManageRelationshipCustomItem } from './ManageRelationshipCustomItem'

interface Props {
  anchorEl: HTMLButtonElement | null
  contactTouchFreq: Nullable<number>
  onChangeTouchFreq(newValue: Nullable<number>): void
  onClose: () => void
}

const useStyles = makeStyles(
  theme => ({
    menu: { minWidth: 200 }
  }),
  { name: 'ManageRelationshipMenu' }
)

export function ManageRelationshipMenu({
  anchorEl,
  contactTouchFreq,
  onChangeTouchFreq,
  onClose
}: Props) {
  const classes = useStyles()

  const isOpen = Boolean(anchorEl)

  const [isCustomItem, setIsCustomItem] = useState(false)
  const openCustomItem = () => {
    setIsCustomItem(true)
  }

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      transitionDuration={0}
    >
      {isCustomItem ? (
        <ManageRelationshipCustomItem
          contactTouchFreq={contactTouchFreq}
          onChangeTouchFreq={onChangeTouchFreq}
        />
      ) : (
        <List className={classes.menu} role="menu">
          {/* 
            We have to use `as unknown as number[]` because
            Object.keys has wrong return type for some reason
            https://github.com/Microsoft/TypeScript/issues/12870
          */}
          {Object.keys(frequencyOptions).map(value => (
            <MenuItem
              key={value}
              onClick={() => {
                onChangeTouchFreq(Number(value))
              }}
            >
              {frequencyToString(Number(value))}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem onClick={openCustomItem}>Custom...</MenuItem>
        </List>
      )}
    </Popover>
  )
}
