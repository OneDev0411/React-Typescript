import { useState } from 'react'

import { Grid, Theme, useTheme } from '@material-ui/core'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { getContextsByBrand } from 'actions/deals'
import ActionButton from 'components/Button/ActionButton'
import { addNotification } from 'components/notification'
import { useActiveBrandId } from 'hooks/brand/use-active-brand-id'
import { useUnsafeActiveTeam } from 'hooks/team/use-unsafe-active-team'
import { forcePushReminderNotificationSettings } from 'models/reminder-notifications/force-push-reminder-notification-settings'
import {
  ReminderNotificationSetting,
  updateReminderNotificationSettings
} from 'models/reminder-notifications/update-reminder-notification-settings'
import Loading from 'partials/Loading'
import { IAppState } from 'reducers'
import { selectBrandContexts } from 'reducers/deals/contexts'
import { hasUserAccessToCrm, hasUserAccessToDeals } from 'utils/acl'

import Column from './components/Column'
import { RENDER_FORCE_PUSH_BUTTON } from './constants'
import { getContactColumn } from './helpers/get-contact-column'
import { getDealColumn } from './helpers/get-deal-column'
import { getSettings } from './helpers/get-settings'
import { getSettingsFromColumns } from './helpers/get-settings-from-columns'
import { updateNewColumnInColumns } from './helpers/update-new-column-in-columns'
import { ColumnState } from './types'

export default function ReminderNotifications() {
  const activeBrandId = useActiveBrandId()
  const activeTeam = useUnsafeActiveTeam()
  const deals = useSelector((state: IAppState) => state.deals)
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

      if (hasUserAccessToDeals(activeTeam)) {
        const dealContexts = await getDealContexts()

        columns.push(getDealColumn(dealContexts, settings))
      }

      if (hasUserAccessToCrm(activeTeam)) {
        columns.push(getContactColumn(contactsAttributeDefs, settings))
      }

      return columns

      async function getDealContexts(): Promise<readonly IDealBrandContext[]> {
        // const dealContexts = getDealContextsFromStore()
        const dealContexts = selectBrandContexts(deals.contexts, activeBrandId)

        if (dealContexts) {
          return dealContexts
        }

        await dispatch(getContextsByBrand(activeBrandId))

        return dealContexts ?? []
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
        <Grid container justifyContent="space-around" spacing={4}>
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
