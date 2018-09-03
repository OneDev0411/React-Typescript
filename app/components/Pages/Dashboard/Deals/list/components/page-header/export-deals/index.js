import React from 'react'
import moment from 'moment'
import { getActiveTeamId } from '../../../../../../../../utils/user-teams'

import XlsxIcon from 'views/components/SvgIcons/Xlsx/XlsxIcon'
import { BasicDropdown } from 'views/components/BasicDropdown'

import { DropdownItem, DropdownItemSub } from './styled'

class ExportDeals extends React.Component {
  items = [
    {
      label: 'All Deals',
      url: `/api/deals/export/${getActiveTeamId(this.props.user)}`
    },
    {
      label: 'New Listings',
      subTitle: '(Past 7 days)',
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
            branch_title: 'Office'
          },
          order: 'list_date',
          title: 'New Listings',
          brand: getActiveTeamId(this.props.user)
        })
      )}`
    },
    {
      label: 'New Offers',
      subTitle: '(Past 7 days)',
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
            seller_agent: 'Seller Agent'
          },
          order: 'contract_date',
          title: 'New Offers',
          brand: getActiveTeamId(this.props.user)
        })
      )}`
    }
  ]
  render() {
    return (
      <BasicDropdown
        style={{ marginRight: '1rem' }}
        items={this.items}
        buttonIcon={XlsxIcon}
        buttonText="Download Report"
        itemRenderer={({ item, ...rest }) => (
          <DropdownItem href={item.url} key={item.label} {...rest}>
            {item.label} <DropdownItemSub>{item.subTitle}</DropdownItemSub>
          </DropdownItem>
        )}
      />
    )
  }
}

export default ExportDeals
