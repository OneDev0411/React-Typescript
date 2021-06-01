import React, { useState } from 'react'
import { useDispatch, useStore, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { useEffectOnce } from 'react-use'
import { Grid, Theme, useTheme } from '@material-ui/core'

import { addNotification } from 'components/notification'

import {
  getActiveTeamId,
  hasUserAccessToCrm,
  hasUserAccessToDeals
} from 'utils/user-teams'

import {
  ReminderNotificationSetting,
  updateReminderNotificationSettings
} from 'models/reminder-notifications/update-reminder-notification-settings'
import { forcePushReminderNotificationSettings } from 'models/reminder-notifications/force-push-reminder-notification-settings'

import { getContextsByBrand } from 'actions/deals'

import { IAppState } from 'reducers'
import { selectBrandContexts } from 'reducers/deals/contexts'

import ActionButton from 'components/Button/ActionButton'
import Loading from 'partials/Loading'

import { selectUser } from 'selectors/user'

import { RENDER_FORCE_PUSH_BUTTON } from './constants'

import Column from './components/Column'

import { ColumnState } from './types'

import { getSettings } from './helpers/get-settings'
import { getDealColumn } from './helpers/get-deal-column'
import { getContactColumn } from './helpers/get-contact-column'
import { getSettingsFromColumns } from './helpers/get-settings-from-columns'
import { updateNewColumnInColumns } from './helpers/update-new-column-in-columns'

export default function ReminderNotifications() {
  const store = useStore<IAppState>()
  const user = useSelector(selectUser)
  const contactsAttributeDefs = useSelector(
    ({ contacts }: IAppState) => contacts.attributeDefs
  )

  const [isLoading, setIsLoading] = useState(true)
  const [columns, setColumns] = useState<readonly ColumnState[]>([])

  const dispatch = useDispatch()

  const theme = useTheme<Theme>()

  const handleReminderNotificationChange = async (
    newSettings: readonly ReminderNotificationSetting[]
  ): Promise<void> => {
    try {
      await updateReminderNotificationSettings(newSettings)
    } catch (error) {
      console.error(error)
      dispatch(
        addNotification({
          status: 'error',
          message: 'Unable to update reminder notifications.'
        })
      )
    }
  }

  const setColumn = (newColumn: ColumnState): void => {
    const newColumns = updateNewColumnInColumns(newColumn, columns)
    const newSettings = getSettingsFromColumns(newColumns)

    handleReminderNotificationChange(newSettings)
    setColumns(newColumns)
  }

  useEffectOnce(() => {
    initializeColumns()

    async function initializeColumns(): Promise<void> {
      try {
        const columns = await getColumns()

        setColumns(columns)
      } catch (error) {
        console.error(error)
        dispatch(
          addNotification({
            status: 'error',
            message: 'Unable to fetch reminder notification settings.'
          })
        )
      } finally {
        setIsLoading(false)
      }
    }

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

          return selectBrandContexts(deals.contexts, getActiveTeamId(user))
        }
      }
    }
  })

  return (
    <>
      <Helmet>
        <title>Reminder Notifications | Settings | Rechat</title>
      </Helmet>
      <div>
        {RENDER_FORCE_PUSH_BUTTON && (
          <ActionButton
            appearance="outline"
            style={{ marginLeft: theme.spacing(4) }}
            onClick={() => forcePushReminderNotificationSettings()} // TODO: Handle exceptions, needs to be refactored
          >
            Force Push Notifications
          </ActionButton>
        )}
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid container justify="space-around" spacing={4}>
          {columns.map((column, index) => (
            <Grid item key={index}>
              <Column
                title={column.title}
                items={column.items}
                onChange={newItem =>
                  setColumn({
                    ...column,
                    items: column.items.map(item =>
                      item.eventType === newItem.eventType ? newItem : item
                    )
                  })
                }
                onChangeAll={newItems =>
                  setColumn({
                    ...column,
                    items: newItems
                  })
                }
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}
