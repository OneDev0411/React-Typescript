import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  MenuItem,
  createStyles,
  makeStyles,
  Theme,
  Tooltip,
  Button
} from '@material-ui/core'

import { IAppState } from 'reducers'
import Deal from 'models/Deal'
import { createRequestTask } from 'actions/deals/helpers/create-request-task'
import { upsertContexts } from 'actions/deals'
import { getDealChecklists } from 'reducers/deals/checklists'
import { getActiveChecklist } from 'models/Deal/helpers/get-active-checklist'
import { useDealStatuses } from 'hooks/use-deal-statuses'
import DealContext, { getDefinition } from 'models/Deal/helpers/dynamic-context'

import { getStatusColorClass } from 'utils/listing'

import { BaseDropdown } from 'components/BaseDropdown'
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

  const [isSaving, setIsSaving] = useState(false)
  const statuses = useDealStatuses(deal.id)

  const dispatch = useDispatch()
  const checklists = useSelector(({ deals }: IAppState) =>
    getDealChecklists(deal, deals.checklists)
  )
  const user = useSelector(selectUser)

  const statusName =
    deal.has_active_offer || deal.deal_type === 'Buying'
      ? 'contract_status'
      : 'listing_status'

  const definition = getDefinition(deal.id, statusName)
  const isDisabled = !!(deal.listing && definition?.preffered_source === 'MLS')

  /**
   * updates listing_status context
   * @param {Object} selectedItem the selected dropdown item
   */
  const updateStatus = async (item: IDealStatus): Promise<void> => {
    if (isSaving) {
      return
    }

    if (item.admin_only && !deal.is_draft && !isBackOffice) {
      notifyAdmin(item.label)

      return
    }

    setIsSaving(true)

    await dispatch(
      upsertContexts(deal.id, [
        DealContext.createUpsertObject(
          deal,
          DealContext.getStatusField(deal),
          item.label,
          true
        )
      ])
    )

    // set state
    setIsSaving(false)
  }

  const getDealType = (): IDealType => {
    if (deal.has_active_offer) {
      return 'Buying'
    }

    return deal.deal_type
  }

  /**
   * creates a new generic task and sends a notification to admin
   * @param {String} status the new deal status
   */
  const notifyAdmin = async status => {
    const checklist = getActiveChecklist(deal, checklists)

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

  const dealStatus = Deal.get.status(deal)

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
            <Button
              {...buttonProps}
              variant="outlined"
              size="small"
              disabled={isDisabled}
            >
              {dealStatus && (
                <span
                  className={classes.bullet}
                  style={{
                    backgroundColor: getStatusColorClass(dealStatus)
                  }}
                />
              )}
              {isSaving ? 'Saving...' : dealStatus || 'Change Status'}
            </Button>
          </span>
        </Tooltip>
      )}
      renderMenu={({ close }) => (
        <div>
          {statuses
            .filter(
              status =>
                status.deal_types.includes(getDealType()) &&
                status.property_types.includes(deal.property_type)
            )
            .map((item, index) => (
              <MenuItem
                key={index}
                value={index}
                selected={item.label === dealStatus}
                onClick={() => {
                  close()
                  updateStatus(item)
                }}
              >
                <span
                  className={classes.bullet}
                  style={{
                    backgroundColor: getStatusColorClass(item.label)
                  }}
                />
                {item.label}
              </MenuItem>
            ))}
        </div>
      )}
    />
  )
}
