import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { MenuItem, createStyles, makeStyles, Theme } from '@material-ui/core'

import { createRequestTask } from 'actions/deals/helpers/create-request-task'

import { upsertContexts } from 'actions/deals'

import { getDealChecklists } from 'reducers/deals/checklists'
import { getActiveChecklist } from 'models/Deal/helpers/get-active-checklist'

import { IAppState } from 'reducers'

import Deal from 'models/Deal'

import { useDealStatuses } from 'hooks/use-deal-statuses'

import DealContext from 'models/Deal/helpers/dynamic-context'

import { BaseDropdown } from 'components/BaseDropdown'

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
  const statuses = useDealStatuses(deal.brand.id)

  const dispatch = useDispatch()
  const { user, checklists } = useSelector(({ user, deals }: IAppState) => ({
    user,
    checklists: getDealChecklists(deal, deals.checklists)
  }))

  /**
   * updates listing_status context
   * @param {Object} selectedItem the selected dropdown item
   */
  const updateStatus = async (item: IDealStatus): Promise<void> => {
    if (isSaving) {
      return
    }

    if (item.admin_only && !isBackOffice) {
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

  const getStatusColor = (status: string) => {
    const item = statuses.find(item => item.label === status)

    return item ? item.color : 'transparent'
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

  if (deal.is_draft) {
    return null
  }

  const dealStatus = Deal.get.status(deal)

  return (
    <BaseDropdown
      buttonLabel={
        <>
          <span
            className={classes.bullet}
            style={{
              backgroundColor: getStatusColor(dealStatus)
            }}
          />

          {isSaving ? 'Saving...' : dealStatus}
        </>
      }
      DropdownToggleButtonProps={{
        variant: 'outlined',
        size: 'small'
      }}
      renderMenu={({ close }) => (
        <div>
          {statuses
            .filter(
              status =>
                status.deal_types.includes(deal.deal_type) &&
                status.property_types.includes(deal.property_type)
            )
            .map((item, index) => (
              <MenuItem
                key={index}
                value={index}
                onClick={() => {
                  close()
                  updateStatus(item)
                }}
              >
                <span
                  className={classes.bullet}
                  style={{
                    backgroundColor: item.color
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
