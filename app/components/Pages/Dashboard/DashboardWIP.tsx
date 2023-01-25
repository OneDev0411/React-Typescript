/*
  TODO: due to time limit I just convert it to typescript and small
  improvmennt to fix the bug but it would be good if make it better in typescript
*/
import {
  useMemo,
  useEffect,
  useCallback,
  ReactElement,
  cloneElement
} from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { useEffectOnce, useTitle } from 'react-use'

import {
  getDashboardAccessList,
  AccessListType
} from '@app/components/helpers/get-dashboard-access-list'
import syncOpenHouseData from '@app/components/helpers/sync-open-house-offline-registers'
import { useLoadUserAndActiveTeam } from '@app/hooks/use-load-user-and-active-team'
import { IAppState } from '@app/reducers'
import {
  isLoadedContactAttrDefs,
  IAttributeDefsState
} from '@app/reducers/contacts/attributeDefs'
import { RouteComponentProps } from '@app/routes/types'
import { withRouter } from '@app/routes/with-router'
import { selectContactAttributeDefs } from '@app/selectors/contacts'
import { selectDeals, selectDealsList } from '@app/selectors/deals'
import ChatSocket from '@app/services/socket/chat'
import ContactSocket from '@app/services/socket/contacts'
import DealSocket from '@app/services/socket/deals'
import NotificationSocket from '@app/services/socket/Notifications'
import ShowingSocket from '@app/services/socket/showings'
import { getAttributeDefs } from '@app/store_actions/contacts'
import { getDeals, searchDeals } from '@app/store_actions/deals'
import { deactivateIntercom } from '@app/store_actions/intercom'
import getFavorites from '@app/store_actions/listings/favorites/get-favorites'
import { getAllNotifications } from '@app/store_actions/notifications'
import { fetchShowingTotalNotificationCount } from '@app/store_actions/showings'
import { viewAsEveryoneOnTeam } from '@app/utils/user-teams'
import CheckBrowser from '@app/views/components/CheckBrowser'
import EmailVerificationBanner from '@app/views/components/EmailVerificationBanner'
import Intercom from '@app/views/components/Intercom'

import { DashboardLayout } from './DashboardLayout'
import useNotificationBadgesContext from './SideNav/notificationBadgesContext/useNotificationBadgesContext'

type DashboardState = {
  isFetchingDeals: boolean
  deals: Record<UUID, IDeal>
  contactsAttributeDefs: IAttributeDefsState
}

interface DashboardProps extends RouteComponentProps<{ id?: string }> {
  children: ReactElement
}

export function DashboardPage({ params, children, location }: DashboardProps) {
  const documentTitle = () => {
    let title = ''

    switch (location.pathname) {
      case '/dashboard/contacts':
        title = 'Contacts | Rechat'
        break
      default:
        title = 'Rechat | Today'
    }

    return title
  }

  useTitle(documentTitle())

  const { user, activeTeam } = useLoadUserAndActiveTeam()
  const { reload: reloadNotificationBadges } = useNotificationBadgesContext()

  const { deals, isFetchingDeals, contactsAttributeDefs }: DashboardState =
    useSelector((state: IAppState) => ({
      deals: selectDealsList(state),
      contactsAttributeDefs: selectContactAttributeDefs(state),
      isFetchingDeals: selectDeals(state).properties.isFetchingDeals
    }))
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

  const handleOnlineEvent = useCallback(() => {
    reloadNotificationBadges()
  }, [reloadNotificationBadges])

  const initializeSockets = (user: IUser) => {
    new NotificationSocket(user)
    new ChatSocket(user)

    if (hasCrmAccess) {
      new ContactSocket(user)
    }

    if (hasDealsAccess) {
      new DealSocket(user)
    }

    if (hasShowingsAccess) {
      new ShowingSocket(user)
    }
  }

  useEffectOnce(() => {
    const init = async () => {
      if (!user) {
        return
      }

      initializeSockets(user)

      if (!activeTeam) {
        return
      }

      // load deals
      if (
        hasDealsAccess &&
        Object.keys(deals).length === 0 &&
        !isFetchingDeals
      ) {
        const searchParamValue =
          location.pathname.startsWith('/dashboard/deals') &&
          new URLSearchParams(location.search).get('q')

        if (
          (hasBackOfficeAccess || viewAsEveryoneOnTeam(activeTeam)) &&
          !searchParamValue
        ) {
          dispatch(getDeals(activeTeam))
        } else {
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
        !isLoadedContactAttrDefs(contactsAttributeDefs)
      ) {
        dispatch(getAttributeDefs())
      }

      dispatch(getAllNotifications())

      // Get MLS favorites
      dispatch(getFavorites(user))

      dispatch(syncOpenHouseData(user.access_token))

      if (hasCrmAccess) {
        window.addEventListener('online', handleOnlineEvent)
      }

      // fetch the number of showing notifications count
      if (hasShowingsAccess) {
        dispatch(fetchShowingTotalNotificationCount())
      }
    }

    init()
  })

  useEffect(() => {
    return () => {
      dispatch(deactivateIntercom(true))

      if (activeTeam && hasCrmAccess) {
        window.removeEventListener('online', handleOnlineEvent)
      }
    }
  }, [activeTeam, dispatch, handleOnlineEvent, hasCrmAccess])

  return (
    <CheckBrowser id={params.id}>
      <div className="u-scrollbar">
        {user && !user.email_confirmed && !user.fake_email && (
          <EmailVerificationBanner show email={user.email} />
        )}

        <DashboardLayout>
          {cloneElement(children, {
            data: {
              path: location.pathname,
              location
            },
            user
          })}
        </DashboardLayout>

        <Intercom />
      </div>
    </CheckBrowser>
  )
}

export const Dashboard = withRouter(DashboardPage)
