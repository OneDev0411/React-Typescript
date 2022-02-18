import { useState } from 'react'

import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { browserHistory, withRouter, WithRouterProps } from 'react-router'

import { markNotificationAsSeen } from 'actions/notifications'
import PageLayout from 'components/GlobalPageLayout'
import LoadingContainer from 'components/LoadingContainer'
import { IAppState } from 'reducers/index'
import {
  selectNotificationNewCount,
  selectNotifications,
  selectNotificationIsFetching
} from 'reducers/notifications'
import { selectUser } from 'selectors/user'

import { CrmEvents } from './CrmEvents'
import EmptyState from './EmptyState'
import Header from './Header'
import List from './List'

function Notifications({ params }: WithRouterProps) {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isFetching = useSelector((store: IAppState) =>
    selectNotificationIsFetching(store.globalNotifications)
  )
  const notifications = useSelector((store: IAppState) =>
    selectNotifications(store.globalNotifications)
  )
  const unreadNotificationsCount = useSelector((store: IAppState) =>
    selectNotificationNewCount(store.globalNotifications)
  )
  const [selectedEvent, setSelectedEvent] = useState<UUID | null>(
    (params.type && params.type === 'crm' && params.id) || null
  )

  const documentTitle = () => {
    const counter =
      unreadNotificationsCount > 0 ? `: ${unreadNotificationsCount} unread` : ''

    return `Notifications${counter} | Rechat`
  }

  const openCRMTaskDrawer = selectedEvent => {
    setSelectedEvent(selectedEvent)
    browserHistory.push(`/dashboard/notifications/crm/${selectedEvent.id}`)
  }

  const closeCRMTaskDrawer = () => {
    setSelectedEvent(null)
    browserHistory.push('/dashboard/notifications')
  }

  const handleNotifClick = (notification: INotification) => {
    dispatch(markNotificationAsSeen(notification.id))

    switch (notification.notification_type) {
      case 'DealRoleReactedToEnvelope':
        browserHistory.push(`/dashboard/deals/${notification.objects[0].deal}`)
        break
      case 'UserReactedToEnvelope':
        browserHistory.push(`/dashboard/deals/${notification.objects[0].deal}`)
        break
      case 'OpenHouseAvailableListing':
        browserHistory.push(`/dashboard/mls/${notification.objects[0].id}`)
        break
      case 'ContactAttributeIsDueContact':
        browserHistory.push(`/dashboard/contacts/${notification.objects[0].id}`)
        break
      case 'DealContextIsDueDeal':
        browserHistory.push(`/dashboard/deals/${notification.objects[0].id}`)
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
        browserHistory.push(`/dashboard/mls/${notification.subjects[0].id}`)
        break
      case 'EmailCampaignReactedToEmailCampaign':
      case 'EmailCampaignReactedToEmailCampaignEmail':
        browserHistory.push(
          `/dashboard/insights/${notification.subjects[0].id}`
        )
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

  return (
    <PageLayout>
      <Helmet>
        <title>{documentTitle()}</title>
      </Helmet>
      <Header />
      <PageLayout.Main>
        {renderContent()}
        {selectedEvent && (
          <CrmEvents
            isOpen
            deleteCallback={closeCRMTaskDrawer}
            onClose={closeCRMTaskDrawer}
            selectedEvent={selectedEvent}
            submitCallback={closeCRMTaskDrawer}
            user={user}
          />
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default withRouter(Notifications)
