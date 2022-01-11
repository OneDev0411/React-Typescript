import { useMemo } from 'react'

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
import { mdiArrowDown } from '@mdi/js'
import moment from 'moment'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { BaseDropdown } from 'components/BaseDropdown'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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

export function ExportDeals() {
  const classes = useStyles()
  const activeBrandId = useActiveBrandId()

  const items = useMemo(() => {
    return [
      {
        label: 'All Deals',
        url: `/api/deals/export/${activeBrandId}`
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
                key: 'is_lease',
                type: 'point',
                point: false
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
            brand: activeBrandId
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
                key: 'checklist_type',
                type: 'set',
                set: ['Buying', 'Offer'],
                invert: false
              },
              {
                key: 'is_lease',
                type: 'point',
                point: false
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
              buyer_agent: 'Buyer Agent',
              office: 'Office',
              sales_price: 'Sales Price',
              closing_date: 'Closing Date',
              seller_agent: 'Seller Agent',
              buyers: 'Buyers'
            },
            order: 'contract_date',
            title: 'New Offers',
            brand: activeBrandId
          })
        )}`
      }
    ]
  }, [activeBrandId])

  return (
    <BaseDropdown
      renderDropdownButton={({ isActive, ...buttonProps }) => (
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
