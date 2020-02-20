import React, { useMemo } from 'react'
import moment from 'moment'

import {
  makeStyles,
  createStyles,
  Theme,
  Button,
  MenuItem
} from '@material-ui/core'

import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import IconArrowDown from 'components/SvgIcons/ArrowDown/IconArrowDown'

import { BaseDropdown, RenderToggleButtonProps } from 'components/BaseDropdown'
import { getActiveTeamId } from 'utils/user-teams'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    exportButton: {
      marginLeft: theme.spacing(1)
    }
  })
)

interface Props {}

export function ExportDeals(props: Props) {
  const classes = useStyles()

  const user = useSelector((state: IAppState) => state.user)

  const items = useMemo(() => {
    return [
      {
        label: 'All Deals',
        url: `/api/deals/export/${getActiveTeamId(user)}`
      },
      {
        label: 'New Listings (Past 7 days)',
        url: `/api/deals/report/${encodeURIComponent(
          JSON.stringify({
            filter: [
              {
                key: 'deal_type',
                type: 'point',
                point: 'Selling',
                invert: false
              },
              {
                key: 'property_type',
                type: 'set',
                set: ['Residential Lease', 'Commercial Lease'],
                invert: true
              },
              {
                key: 'list_date',
                type: 'range',
                high: moment().unix(),
                low: moment()
                  .add(-7, 'days')
                  .startOf('day')
                  .unix()
              }
            ],
            project: {
              full_address: 'Address',
              seller_agent: 'Agent',
              list_price: 'List Price',
              branch_title: 'Office',
              sellers: 'Sellers'
            },
            order: 'list_date',
            title: 'New Listings',
            brand: getActiveTeamId(user)
          })
        )}`
      },
      {
        label: 'New Offers (Past 7 days)',
        url: `/api/deals/report/${encodeURIComponent(
          JSON.stringify({
            filter: [
              {
                key: 'deal_type',
                type: 'point',
                point: 'Buying',
                invert: false
              },
              {
                key: 'property_type',
                type: 'set',
                set: ['Residential Lease', 'Commercial Lease'],
                invert: true
              },
              {
                key: 'contract_date',
                type: 'range',
                high: moment().unix(),
                low: moment()
                  .add(-7, 'days')
                  .startOf('day')
                  .unix()
              }
            ],
            project: {
              title: 'Address',
              buyer_agent: 'Buyer Agent',
              branch_title: 'Office',
              sales_price: 'Sales Price',
              closing_date: 'Closing Date',
              seller_agent: 'Seller Agent',
              buyers: 'Buyers'
            },
            order: 'contract_date',
            title: 'New Offers',
            brand: getActiveTeamId(user)
          })
        )}`
      }
    ]
  }, [user])

  return (
    <BaseDropdown
      renderDropdownButton={(buttonProps: RenderToggleButtonProps) => (
        <Button
          className={classes.exportButton}
          variant="outlined"
          {...buttonProps}
        >
          <IconArrowDown />
        </Button>
      )}
      renderMenu={({ close }) => (
        <div>
          {items.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                close()
                window.location.href = item.url
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </div>
      )}
    />
  )
}
