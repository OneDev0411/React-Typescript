import React from 'react'
import moment from 'moment'
import { getActiveTeamId } from '../../../../../../../../utils/user-teams'

import XlsxIcon from '../../../../../../../../views/components/SvgIcons/Xlsx/XlsxIcon'
import Dropdown from '../../../../../../../../views/components/SimpleDropdown/index'

import {
  DealsDownloadButton,
  DropdownItem,
  DropdownItemSub,
  Icon
} from './styled'

class ExportDeals extends React.Component {
  items = [
    {
      title: 'All Deals',
      url: `/api/deals/export/${getActiveTeamId(this.props.user)}`
    }
    // {
    //   title: 'New Listings',
    //   subTitle: '(Past 7 days)',
    //   url: `/api/deals/report/${encodeURIComponent(
    //     JSON.stringify({
    //       filter: [
    //         {
    //           key: 'deal_type',
    //           type: 'point',
    //           point: 'Selling',
    //           invert: false
    //         },
    //         {
    //           key: 'property_type',
    //           type: 'set',
    //           set: ['Residential Lease', 'Commercial Lease'],
    //           invert: true
    //         },
    //         {
    //           key: 'list_date',
    //           type: 'range',
    //           high: moment().unix(),
    //           low: moment()
    //             .add(-7, 'days')
    //             .startOf('day')
    //             .unix()
    //         }
    //       ],
    //       project: {
    //         full_address: 'Address',
    //         seller_agent: 'Agent',
    //         list_price: 'List Price',
    //         branch_title: 'Office'
    //       },
    //       order: 'list_date',
    //       title: 'New Listings'
    //     })
    //   )}`
    // },
    // {
    //   title: 'New Offers',
    //   subTitle: '(Past 7 days)',
    //   url: `/api/deals/report/${encodeURIComponent(
    //     JSON.stringify({
    //       filter: [
    //         {
    //           key: 'deal_type',
    //           type: 'point',
    //           point: 'Buying',
    //           invert: false
    //         },
    //         {
    //           key: 'property_type',
    //           type: 'set',
    //           set: ['Residential Lease', 'Commercial Lease'],
    //           invert: true
    //         },
    //         {
    //           key: 'contract_date',
    //           type: 'range',
    //           high: moment().unix(),
    //           low: moment()
    //             .add(-7, 'days')
    //             .startOf('day')
    //             .unix()
    //         }
    //       ],
    //       project: {
    //         title: 'Address',
    //         buyer_agent: 'Buyer Agent',
    //         branch_title: 'Office',
    //         sales_price: 'Sales Price',
    //         closing_date: 'Closing Date',
    //         seller_agent: 'Seller Agent'
    //       },
    //       order: 'contract_date',
    //       title: 'New Offers'
    //     })
    //   )}`
    // }
  ]
  render() {
    return (
      <Dropdown
        renderToggleButton={isOpen => (
          <DealsDownloadButton>
            <XlsxIcon />
            Download Report
            <Icon
              isOpen={isOpen}
              style={{ fill: '#506379', width: '24px', height: '24px' }}
            />
          </DealsDownloadButton>
        )}
        items={this.items}
        renderItem={(item, closeMenu) => (
          <DropdownItem
            href={item.url}
            key={item.title}
            onClick={() => closeMenu()}
          >
            {item.title} <DropdownItemSub>{item.subTitle}</DropdownItemSub>
          </DropdownItem>
        )}
      />
    )
  }
}

export default ExportDeals
