import React, { useMemo } from 'react'
import moment from 'moment'

import {
  makeStyles,
  createStyles,
  Theme,
  Button,
  List,
  ListItem,
  ListItemText,
  Tooltip
} from '@material-ui/core'

import { useSelector } from 'react-redux'
import { mdiArrowDown } from '@mdi/js'

import { selectUser } from 'selectors/user'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { IAppState } from 'reducers'
import { BaseDropdown, RenderToggleButtonProps } from 'components/BaseDropdown'
import { getActiveTeamId } from 'utils/user-teams'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    exportButton: {
      marginLeft: theme.spacing(1),
      minWidth: theme.spacing(5.5),
      padding: theme.spacing(1, 1)
    },
    listItem: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    }
  })
)

export function ExportDeals(props) {
  const classes = useStyles()

  const user = useSelector((state: IAppState) => selectUser(state))

  const items = useMemo(() => {
    return [
      {
        label: 'All Deals',
        url: `/api/deals/export/${getActiveTeamId(user)}`
      },
      {
        label: 'New Listings',
        description: 'Past 7 days',
        url: `/api/deals/report/${btoa(
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
                low: moment().add(-7, 'days').startOf('day').unix()
              }
            ],
            project: {
              full_address: 'Address',
              seller_agent: 'Agent',
              list_price: 'List Price',
              office: 'Office',
              sellers: 'Sellers'
            },
            order: 'list_date',
            title: 'New Listings',
            brand: getActiveTeamId(user)
          })
        )}`
      },
      {
        label: 'New Offers',
        description: 'Past 7 days',
        url: `/api/deals/report/${btoa(
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
                low: moment().add(-7, 'days').startOf('day').unix()
              }
            ],
            project: {
              title: 'Address',
              agent: 'Agent',
              office: 'Office',
              sales_price: 'Sales Price',
              closing_date: 'Closing Date',
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
        <Tooltip placement="bottom" title="Export Deals">
          <Button
            className={classes.exportButton}
            variant="outlined"
            size="large"
            {...buttonProps}
          >
            <SvgIcon path={mdiArrowDown} />
          </Button>
        </Tooltip>
      )}
      renderMenu={({ close }) => (
        <List>
          {items.map((item, index) => (
            <ListItem
              key={index}
              className={classes.listItem}
              onClick={() => {
                close()
                window.location.href = item.url
              }}
            >
              <ListItemText primary={item.label} secondary={item.description} />
            </ListItem>
          ))}
        </List>
      )}
    />
  )
}
