import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { browserHistory, withRouter } from 'react-router'
import { Helmet } from 'react-helmet'

import PageLayout from 'components/GlobalPageLayout'
import LoadingContainer from 'components/LoadingContainer'

import List from './List'
import EmptyState from './EmptyState'
import { selectNotificationNewCount } from '../../../../reducers/notifications'

import {
  selectNotifications,
  selectNotificationIsFetching
} from '../../../../reducers/notifications'
import { markNotificationAsSeen } from '../../../../store_actions/notifications'

import Header from './Header'
import { CrmEvents } from './CrmEvents'

function Notifications({ params }) {
  const dispatch = useDispatch()
  const user = useSelector(store => store.user)
  const isFetching = useSelector(store =>
    selectNotificationIsFetching(store.globalNotifications)
  )
  const notifications = useSelector(store =>
    selectNotifications(store.globalNotifications)
  )
  const unreadNotificationsCount = useSelector(store =>
    selectNotificationNewCount(store.globalNotifications)
  )
  const [selectedEvent, setSelectedEvent] = useState(
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

  const handleNotifClick = notification => {
    dispatch(markNotificationAsSeen(notification.id))

    switch (notification.notification_type) {
      case 'DealRoleReactedToEnvelope':
        browserHistory.push(`/dashboard/deals/${notification.objects[0].deal}`)
        break
      case 'UserReactedToEnvelope':
        browserHistory.push(`/dashboard/deals/${notification.objects[0].deal}`)
        break

      case 'ListingPriceDroppedUser':
        browserHistory.push(`/dashboard/mls/${notification.subjects[0].id}`)
        break
      case 'ListingStatusChangedUser':
        browserHistory.push(`/dashboard/mls/${notification.subjects[0].id}`)
        break
      case 'ListingBecameAvailableUser':
        browserHistory.push(`/dashboard/mls/${notification.subjects[0].id}`)
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
        handleNotifClick={handleNotifClick}
        isFetching={isFetching}
        notifications={notifications}
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
