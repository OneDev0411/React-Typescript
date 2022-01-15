import { Component, cloneElement, useMemo } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router'
import { useEffectOnce, useTitle } from 'react-use'

import {
  getDashboardAccessList,
  AccessListType
} from '@app/components/helpers/get-dashboard-access-list'
import syncOpenHouseData from '@app/components/helpers/sync-open-house-offline-registers'
import asyncComponentLoader from '@app/loader'
import { isLoadedContactAttrDefs } from '@app/reducers/contacts/attributeDefs'
import { selectListings } from '@app/reducers/listings'
import ChatSocket from '@app/services/socket/chat'
import ContactSocket from '@app/services/socket/contacts'
import DealSocket from '@app/services/socket/deals'
import NotificationSocket from '@app/services/socket/Notifications'
import ShowingSocket from '@app/services/socket/showings'
import { getRooms } from '@app/store_actions/chatroom'
import { getAttributeDefs } from '@app/store_actions/contacts'
import { getDeals, searchDeals } from '@app/store_actions/deals'
import { fetchUnreadEmailThreadsCount } from '@app/store_actions/inbox'
import { deactivateIntercom } from '@app/store_actions/intercom'
import getFavorites from '@app/store_actions/listings/favorites/get-favorites'
import { getAllNotifications } from '@app/store_actions/notifications'
import { fetchShowingTotalNotificationCount } from '@app/store_actions/showings'
import { viewAsEveryoneOnTeam } from '@app/utils/user-teams'
import CheckBrowser from '@app/views/components/CheckBrowser'
import EmailVerificationBanner from '@app/views/components/EmailVerificationBanner'
import Intercom from '@app/views/components/Intercom'

import { DashboardLayout } from './DashboardLayout'

export function Dashboard(props) {
  useTitle('Rechat | Dashboard')

  const dispatch = useDispatch()

  const {
    hasCrmAccess,
    hasDealsAccess,
    hasShowingsAccess,
    hasBackOfficeAccess
  }: AccessListType = useMemo(
    () => getDashboardAccessList(activeTeam),
    [activeTeam]
  )

  useEffectOnce(() => {
    const init = async () => {
      const { user, activeTeam, deals } = this.props

      console.log('init of dashboard', { user, activeTeam, deals })

      if (!activeTeam || !user) {
        return
      }

      dispatch(getRooms())

      // load deals
      if (
        hasDealsAccess &&
        Object.keys(deals).length === 0 &&
        !this.props.isFetchingDeals
      ) {
        const searchParamValue =
          this.props.location.pathname.startsWith('/dashboard/deals') &&
          new URLSearchParams(this.props.location.search).get('q')

        if (
          (hasBackOfficeAccess || viewAsEveryoneOnTeam(activeTeam)) &&
          !searchParamValue
        ) {
          dispatch(getDeals(activeTeam))
          console.log('get deal 1')
        } else {
          console.log('get deal 2')

          dispatch(
            searchParamValue
              ? searchDeals(activeTeam, decodeURIComponent(searchParamValue))
              : getDeals(activeTeam)
          )
        }
      }

      // load CRM attributes definition
      if (
        (hasCrmAccess || hasDealsAccess) &&
        !isLoadedContactAttrDefs(this.props.contactsAttributeDefs)
      ) {
        dispatch(getAttributeDefs())
      }

      this.initializeSockets(user)

      dispatch(getAllNotifications())

      // Get MLS favorites
      dispatch(getFavorites(user))

      dispatch(syncOpenHouseData(user.access_token))

      if (hasCrmAccess) {
        // fetch the number of unread email threads
        dispatch(fetchUnreadEmailThreadsCount())

        window.addEventListener('online', this.handleOnlineEvent)
      }

      // fetch the number of showing notifications count
      if (hasShowingsAccess) {
        dispatch(fetchShowingTotalNotificationCount())
      }
    }

    init()
  })
}
