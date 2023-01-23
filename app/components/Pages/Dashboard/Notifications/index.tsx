import { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useEffectOnce, useTitle } from 'react-use'

import { useNavigate } from '@app/hooks/use-navigate'
import { WithRouterProps } from '@app/routes/types'
import { withRouter } from '@app/routes/with-router'
import {
  getAllNotifications,
  markNotificationAsSeen
} from '@app/store_actions/notifications'
import PageLayout from 'components/GlobalPageLayout'
import LoadingContainer from 'components/LoadingContainer'
import { IAppState } from 'reducers/index'
import {
  selectNotifications,
  selectNotificationIsFetching
} from 'reducers/notifications'
import { selectUser } from 'selectors/user'

import useNotificationsBadgesContext from '../SideNav/notificationsBadgesContext/useNotificationsBadgesContext'

import { CrmEvents } from './CrmEvents'
import EmptyState from './EmptyState'
import Header from './Header'
import List from './List'

function Notifications({ params }: WithRouterProps) {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const navigate = useNavigate()
  const { decreaseBadge, badges } = useNotificationsBadgesContext()

  useEffectOnce(() => {
    dispatch(getAllNotifications())
  })

  const isFetching = useSelector((store: IAppState) =>
    selectNotificationIsFetching(store.globalNotifications)
  )
  const notifications = useSelector((store: IAppState) =>
    selectNotifications(store.globalNotifications)
  )

  const [selectedEvent, setSelectedEvent] = useState<UUID | null>(
    (params.type && params.type === 'crm' && params.id) || null
  )

  const documentTitle = () => {
    const counter =
      badges.unread_email_threads > 0
        ? `: ${badges.unread_email_threads} unread`
        : ''

    return `Notifications${counter} | Rechat`
  }

  const openCRMTaskDrawer = (selectedEvent: ICRMTask) => {
    setSelectedEvent(selectedEvent.id)
    navigate(`/dashboard/notifications/crm/${selectedEvent.id}`)
  }

  const closeCRMTaskDrawer = () => {
    setSelectedEvent(null)
    navigate('/dashboard/notifications')
  }

  const handleNotifClick = (notification: INotification) => {
    dispatch(markNotificationAsSeen(notification.id))

    if (!notification.seen) {
      decreaseBadge('generic')
    }

    switch (notification.notification_type) {
      case 'DealRoleReactedToEnvelope':
        navigate(`/dashboard/deals/${notification.objects[0].deal}`)
        break
      case 'UserReactedToEnvelope':
        navigate(`/dashboard/deals/${notification.objects[0].deal}`)
        break
      case 'OpenHouseAvailableListing':
        navigate(`/dashboard/mls/${notification.objects[0].id}`)
        break
      case 'ContactAttributeIsDueContact':
      case 'UserCapturedContact':
        navigate(`/dashboard/contacts/${notification.objects[0].id}`)
        break
      case 'DealContextIsDueDeal':
        navigate(`/dashboard/deals/${notification.objects[0].id}`)
        break
      case 'CrmTaskIsDueCrmTask':
      case 'ReminderIsDueCrmTask':
      case 'UserAssignedCrmTask':
      case 'UserEditedCrmTask':
        openCRMTaskDrawer(notification.objects[0])
        break
      case 'ListingPriceDroppedUser':
      case 'ListingStatusChangedUser':
      case 'ListingBecameAvailableUser':
        navigate(`/dashboard/mls/${notification.subjects[0].id}`)
        break
      case 'EmailCampaignReactedToEmailCampaign':
      case 'EmailCampaignReactedToEmailCampaignEmail':
        navigate(`/dashboard/insights/${notification.subjects[0].id}`)
        break
      default:
        break
    }
  }

  const renderContent = () => {
    if (isFetching) {
      return <LoadingContainer style={{ padding: '30vh 0 0' }} />
    }

    if (notifications.length === 0) {
      return <EmptyState />
    }

    return (
      <List
        isFetching={isFetching}
        notifications={notifications}
        handleNotifClick={handleNotifClick}
      />
    )
  }

  useTitle(documentTitle())

  return (
    <PageLayout>
      <Header />
      <PageLayout.Main>
        {renderContent()}
        {selectedEvent && (
          <CrmEvents
            isOpen
            deleteCallback={closeCRMTaskDrawer}
            onClose={closeCRMTaskDrawer}
            selectedEvent={{
              id: selectedEvent
            }}
            submitCallback={closeCRMTaskDrawer}
            user={user}
          />
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default withRouter(Notifications)
