import React, { MouseEvent, useState } from 'react'
import { makeStyles, createStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import { Item } from './types'
import Button from './Button'
import items from './items'
import Menu from './Menu'

const useStyles = makeStyles(theme =>
  createStyles({
    wrapper: {
      margin: theme.spacing(0, 2)
    }
  })
)

export default function GlobalActionsButton() {
  const classes = useStyles()
  const user = useSelector((state: IAppState) => state.user as IUser)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedItem, setSelectedItem] = useState<null | Item>(null)

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleItemClick = (item: Item) => {
    setSelectedItem(item)
    handleMenuClose()
  }

  const handleCloseRenderedItem = () => {
    setSelectedItem(null)
  }

  const renderSelectedItem = () => {
    if (!selectedItem) {
      return
    }

    switch (selectedItem.type) {
      case 'email':
        return selectedItem.render({
          isOpen: true,
          initialValues: {
            from: user
          },
          onClose: handleCloseRenderedItem,
          onSent: handleCloseRenderedItem
        })

      case 'event':
        return selectedItem.render({
          user,
          isOpen: true,
          submitCallback: handleCloseRenderedItem,
          onClose: handleCloseRenderedItem
        })

      case 'contact':
        return selectedItem.render({
          user,
          isOpen: true,
          onClose: handleCloseRenderedItem,
          submitCallback: handleCloseRenderedItem
        })

      case 'deal':
        selectedItem.redirectTo('/dashboard/deals/create')

        return null

      case 'openhouse':
        return selectedItem.render({
          isOpen: true,
          onClose: handleCloseRenderedItem,
          submitCallback: handleCloseRenderedItem
        })

      case 'tour':
        return selectedItem.render({
          user,
          isOpen: true,
          listings: [],
          onClose: handleCloseRenderedItem,
          submitCallback: handleCloseRenderedItem
        })
    }
  }

  return (
    <>
      <div className={classes.wrapper}>
        <Button onMouseEnter={handleMenuOpen} />
        <Menu
          items={items}
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          onItemClick={handleItemClick}
        />
      </div>
      {renderSelectedItem()}
    </>
  )
}
