import React, { MouseEvent, useState, useMemo, memo } from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import {
  hasUserAccessToCrm,
  hasUserAccessToDeals,
  hasUserAccessToMarketingCenter
} from 'utils/user-teams'

import { Item, ItemType } from './types'
import Button from './components/Button'
import items from './components/items'
import Menu from './components/Menu'
import { useGlobalActionContext } from './hooks/use-global-action-context'

interface Props {}

export const GlobalActions = (props: Props) => {
  const user = useSelector<IAppState, IUser>((state: IAppState) => state.user)
  const [state] = useGlobalActionContext()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedItem, setSelectedItem] = useState<null | Item>(null)
  const availableItems: Item[] = useMemo(() => {
    const actions: ItemType[] = []

    if (hasUserAccessToCrm(user)) {
      actions.push('email', 'event', 'contact', 'tour')
    }

    if (hasUserAccessToDeals(user)) {
      actions.push('deal')
    }

    if (hasUserAccessToCrm(user) && hasUserAccessToMarketingCenter(user)) {
      actions.push('openhouse')
    }

    return items.filter(item => actions.includes(item.type))
  }, [user])

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setSelectedItem(null)
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
    state.onCreateEvent(event)
    handleCloseRenderedItem()
  }

  const handleSubmitEmail = (email: IEmailCampaign) => {
    state.onCreateEmail(email)
    handleCloseRenderedItem()
  }

  const handleSubmitTour = (
    tour: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => {
    state.onCreateTour(tour)
    handleCloseRenderedItem()
  }

  const handleSubmitOpenHouse = (
    oh: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
  ) => {
    state.onCreateOpenHouse(oh)
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
          followUpCallback: state.onCreateEmailFollowUp,
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
          saveCallback: state.onCreateContact,
          saveAndAddNewCallback: state.onCreateAndAddNewContact
        })

      case 'deal':
        setSelectedItem(null)
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

export const GlobalActionsButton = memo(GlobalActions)
