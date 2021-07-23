import { useState } from 'react'

import {
  MenuItem,
  createStyles,
  makeStyles,
  Theme,
  Tooltip
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import { getContext } from '@app/models/Deal/helpers/context'
import { getDealStatusColor } from '@app/utils/get-deal-status-color'
import { upsertContexts } from 'actions/deals'
import { createRequestTask } from 'actions/deals/helpers/create-request-task'
import { BaseDropdown } from 'components/BaseDropdown'
import { DropdownToggleButton } from 'components/DropdownToggleButton'
import { addNotification as notify } from 'components/notification'
import { useDealStatuses } from 'hooks/use-deal-statuses'
import Deal from 'models/Deal'
import { createContextObject } from 'models/Deal/helpers/brand-context/create-context-object'
import { getStatusContextKey } from 'models/Deal/helpers/brand-context/get-status-field'
import { searchContext } from 'models/Deal/helpers/brand-context/search-context'
import { getActiveChecklist } from 'models/Deal/helpers/get-active-checklist'
import { IAppState } from 'reducers'
import { getBrandChecklistsById } from 'reducers/deals/brand-checklists'
import { getDealChecklists } from 'reducers/deals/checklists'
import { selectUser } from 'selectors/user'

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bullet: {
      width: '12px', // fixed size
      height: '12px', // fixed size
      borderRadius: '100%',
      marginRight: theme.spacing(1)
    }
  })
)

export default function DealStatus({ deal, isBackOffice }: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [isSaving, setIsSaving] = useState(false)
  const statuses = useDealStatuses(deal)

  const { checklists, brandChecklists } = useSelector(
    ({ deals }: IAppState) => ({
      brandChecklists: getBrandChecklistsById(
        deals.brandChecklists,
        deal.brand.id
      ),
      checklists: getDealChecklists(deal, deals.checklists)
    })
  )
  const user = useSelector(selectUser)

  const statusName = getStatusContextKey(deal)

  const definition = searchContext(deal, brandChecklists, statusName)
  const dealContext = getContext(deal, statusName)
  const isDisabled = !!(
    deal.listing &&
    definition?.preffered_source === 'MLS' &&
    dealContext?.source === 'MLS'
  )

  /**
   * updates listing_status context
   * @param {Object} selectedItem the selected dropdown item
   */
  const updateStatus = async (status: IDealStatus): Promise<void> => {
    if (isSaving) {
      return
    }

    if (status.admin_only && !deal.is_draft && !isBackOffice) {
      notifyAdmin(status.label)

      return
    }

    const context = createContextObject(
      deal,
      brandChecklists,
      checklists,
      statusName,
      status.label,
      true
    )

    if (context === null) {
      dispatch(
        notify({
          status: 'error',
          message: 'Could not change the status'
        })
      )

      return
    }

    setIsSaving(true)

    await dispatch(upsertContexts(deal.id, [context]))

    // set state
    setIsSaving(false)
  }

  /**
   * creates a new generic task and sends a notification to admin
   * @param {String} status the new deal status
   */
  const notifyAdmin = async status => {
    const checklist = getActiveChecklist(deal, brandChecklists, checklists)

    if (!checklist) {
      return
    }

    dispatch(
      createRequestTask({
        checklist,
        userId: user.id,
        dealId: deal.id,
        taskType: 'Generic',
        taskTitle: `Change listing status to ${status}`,
        taskComment: `Hello, Please change listing status to ${status}`,
        notifyMessage: 'Back office has been notified to change listing status'
      })
    )
  }

  const dealStatus = statuses.find(
    status => status.label === Deal.get.status(deal)
  )

  return (
    <BaseDropdown
      renderDropdownButton={buttonProps => (
        <Tooltip
          title={
            isDisabled ? (
              <div>
                The status can only be changed on MLS. Once changed, the update
                will be reflected here.
              </div>
            ) : (
              ''
            )
          }
        >
          <span>
            <DropdownToggleButton
              {...buttonProps}
              variant="outlined"
              size="small"
              disabled={isDisabled}
            >
              {dealStatus && (
                <span
                  className={classes.bullet}
                  style={{
                    backgroundColor: getDealStatusColor(dealStatus)
                  }}
                />
              )}
              {isSaving ? 'Saving...' : dealStatus?.label || 'Change Status'}
            </DropdownToggleButton>
          </span>
        </Tooltip>
      )}
      renderMenu={({ close }) => (
        <div>
          {statuses.map((status, index) => (
            <MenuItem
              key={index}
              value={index}
              selected={status.label === dealStatus?.label}
              onClick={() => {
                close()
                updateStatus(status)
              }}
            >
              <span
                className={classes.bullet}
                style={{
                  backgroundColor: getDealStatusColor(status)
                }}
              />
              {status.label}
            </MenuItem>
          ))}
        </div>
      )}
    />
  )
}
