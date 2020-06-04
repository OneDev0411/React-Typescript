import React, { MouseEvent, useState } from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import { Item, ItemType } from './types'
import Button from './Button'
import items from './items'
import Menu from './Menu'

interface Props {
  onCreateEvent: (event: IEvent) => void
  onCreateContact: (contact: IContact) => void
  onCreateEmail: (email: IEmailCampaign) => void
  onCreateTour: (
    tour: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => void
  onCreateOpenHouse: (
    oh: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => void
  availableActions: ItemType[]
}

export default function GlobalActionsButton(props: Props) {
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

  const handleSubmitEvent = (event: IEvent) => {
    props.onCreateEvent(event)
    handleCloseRenderedItem()
  }

  const handleSubmitContact = (contact: IContact) => {
    props.onCreateContact(contact)
    handleCloseRenderedItem()
  }
  const handleSubmitEmail = (email: IEmailCampaign) => {
    props.onCreateEmail(email)
    handleCloseRenderedItem()
  }

  const handleSubmitTour = (
    tour: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => {
    props.onCreateTour(tour)
    handleCloseRenderedItem()
  }

  const handleSubmitOpenHouse = (
    oh: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => {
    props.onCreateOpenHouse(oh)
    handleCloseRenderedItem()
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
          onSent: handleSubmitEmail
        })

      case 'event':
        return selectedItem.render({
          user,
          isOpen: true,
          onClose: handleCloseRenderedItem,
          submitCallback: handleSubmitEvent
        })

      case 'contact':
        return selectedItem.render({
          user,
          isOpen: true,
          onClose: handleCloseRenderedItem,
          submitCallback: handleSubmitContact
        })

      case 'deal':
        selectedItem.redirectTo('/dashboard/deals/create')

        return null

      case 'openhouse':
        return selectedItem.render({
          isOpen: true,
          onClose: handleCloseRenderedItem,
          submitCallback: handleSubmitOpenHouse
        })

      case 'tour':
        return selectedItem.render({
          user,
          isOpen: true,
          listings: [],
          onClose: handleCloseRenderedItem,
          submitCallback: handleSubmitTour
        })
    }
  }

  const availableItems = items.filter(item =>
    props.availableActions.includes(item.type)
  )

  // If no items are available, we should not render the button at all
  if (availableItems.length === 0) {
    return null
  }

  return (
    <>
      <Button onClick={handleMenuOpen} />
      <Menu
        items={availableItems}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        onItemClick={handleItemClick}
      />

      {renderSelectedItem()}
    </>
  )
}
