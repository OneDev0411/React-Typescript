import React, { useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Helmet } from 'react-helmet'
import { useEffectOnce } from 'react-use'
import { addNotification } from 'reapop'
import Flex from 'styled-flex-component'

import {
  getActiveTeamId,
  hasUserAccessToCrm,
  hasUserAccessToDeals
} from 'utils/user-teams'

import useTypedSelector from 'hooks/use-typed-selector'

import { updateReminderNotificationSettings } from 'models/reminder-notifications/update-reminder-notification-settings'
import { forcePushReminderNotificationSettings } from 'models/reminder-notifications/force-push-reminder-notification-settings'

import { getContextsByBrand } from 'actions/deals'

import { IAppState } from 'reducers'
import { selectContextsByBrand } from 'reducers/deals/contexts'

import ActionButton from 'components/Button/ActionButton'
import Loading from 'partials/Loading'

import { renderForcePushButton } from './constants'

import Column from './components/Column'

import { ColumnState } from './types'

import { getSettings } from './helpers/get-settings'
import { getDealColumn } from './helpers/get-deal-column'
import { getContactColumn } from './helpers/get-contact-column'
import { getSettingsFromColumns } from './helpers/get-settings-from-columns'

// TODO: Upgrade the styling solution:
export default function ReminderNotifications() {
  const store = useStore<IAppState>()
  const user = useTypedSelector<IUser>(({ user }) => user)
  const contactsAttributeDefs = useTypedSelector(
    ({ contacts }) => contacts.attributeDefs
  )

  const [isLoading, setIsLoading] = useState(true)
  const [columns, setColumns] = useState<readonly ColumnState[]>([])

  useEffectOnce(() => {
    getColumns()
      .then(setColumns)
      .catch(error => {
        console.error(error)
        dispatch(
          addNotification({
            status: 'error',
            message: 'Unable to fetch reminder notification settings.'
          })
        )
      })
      .finally(() => setIsLoading(false))

    async function getColumns(): Promise<readonly ColumnState[]> {
      const settings = await getSettings()
      const columns: ColumnState[] = []

      if (hasUserAccessToDeals(user)) {
        const dealContexts = await getDealContexts()

        columns.push(getDealColumn(dealContexts, settings))
      }

      if (hasUserAccessToCrm(user)) {
        columns.push(getContactColumn(contactsAttributeDefs, settings))
      }

      return columns

      async function getDealContexts(): Promise<readonly IDealBrandContext[]> {
        const dealContexts = getDealContextsFromStore()

        if (dealContexts) {
          return dealContexts
        }

        const brandId = getActiveTeamId(user)

        await dispatch(getContextsByBrand(brandId))

        return getDealContextsFromStore() ?? []

        function getDealContextsFromStore():
          | readonly IDealBrandContext[]
          | undefined {
          const { deals } = store.getState()

          return selectContextsByBrand(deals.contexts, getActiveTeamId(user))
        }
      }
    }
  })

  const dispatch = useDispatch()

  function updateColumn(newColumn: ColumnState): void {
    setColumns(columns => {
      const newColumns = columns.map(column =>
        column.objectType === newColumn.objectType ? newColumn : column
      )
      const newSettings = getSettingsFromColumns(newColumns)

      updateReminderNotificationSettings(newSettings).catch(error => {
        console.error(error)
        dispatch(
          addNotification({
            status: 'error',
            message: 'Unable to update reminder notifications.'
          })
        )
      })

      return newColumns
    })
  }

  return (
    <>
      <Helmet>
        <title>Reminder Notifications | Settings | Rechat</title>
      </Helmet>
      <div>
        {renderForcePushButton && (
          <ActionButton
            appearance="outline"
            style={{ marginLeft: '2rem' }}
            onClick={() => forcePushReminderNotificationSettings()} // TODO: Handle exceptions, needs to be refactored
          >
            Force Push Notifications
          </ActionButton>
        )}
      </div>
      <Flex>
        {isLoading ? (
          <Loading />
        ) : (
          columns.map((column, index) => (
            <Column
              key={index}
              title={column.title}
              items={column.items}
              onChange={newItem =>
                updateColumn({
                  ...column,
                  items: column.items.map(item =>
                    item.eventType === newItem.eventType ? newItem : item
                  )
                })
              }
              onChangeAll={newItems =>
                updateColumn({
                  ...column,
                  items: newItems
                })
              }
            />
          ))
        )}
      </Flex>
    </>
  )
}
