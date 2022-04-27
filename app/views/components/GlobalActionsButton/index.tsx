import { MouseEvent, useState, useMemo, memo } from 'react'

import { useSelector } from 'react-redux'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { selectUserUnsafe } from 'selectors/user'
import {
  hasUserAccessToCrm,
  hasUserAccessToDeals,
  hasUserAccessToMarketingCenter,
  hasUserAccessToShowings
} from 'utils/acl'

import Button from './components/Button'
import items from './components/items'
import Menu from './components/Menu'
import { useGlobalActionContext } from './hooks/use-global-action-context'
import { Item, ItemType, CustomButtonRenderProps } from './types'

interface Props {
  renderButton?: (renderProps: CustomButtonRenderProps) => React.ReactNode
}

export const GlobalActions = ({ renderButton }: Props) => {
  const activeTeam = useUnsafeActiveTeam()
  const user = useSelector(selectUserUnsafe)
  const [state] = useGlobalActionContext()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedItem, setSelectedItem] = useState<null | Item>(null)
  const availableItems: Item[] = useMemo(() => {
    const actions: ItemType[] = []

    if (hasUserAccessToCrm(activeTeam)) {
      actions.push('email', 'event', 'log', 'contact', 'tour')
    }

    if (hasUserAccessToDeals(activeTeam)) {
      actions.push('deal')
    }

    if (
      hasUserAccessToCrm(activeTeam) &&
      hasUserAccessToMarketingCenter(activeTeam)
    ) {
      actions.push('openhouse')
    }

    if (hasUserAccessToShowings(activeTeam)) {
      actions.push('showing')
    }

    return items.filter(item => actions.includes(item.type))
  }, [activeTeam])

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

      case 'log':
        return selectedItem.render({
          user,
          isOpen: true,
          onClose: handleCloseRenderedItem,
          submitCallback: handleSubmitEvent
        })

      case 'contact':
        return selectedItem.render({
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

      case 'showing':
        setSelectedItem(null)
        selectedItem.redirectTo('/dashboard/showings/create')

        return null
    }
  }

  // If no items are available, we should not render the button at all
  if (availableItems.length === 0) {
    return null
  }

  return (
    <>
      <Button renderButton={renderButton} onClick={handleMenuOpen} />

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
