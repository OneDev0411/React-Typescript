import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'

const options = {
  offer: ['Traditional Sale', 'Condo', 'New Build', 'Farm & Ranch'],
  listing: ['Residental For Sale', 'Lease', 'Lot & Acreage', 'Commercial']
}

const names = {
  offer: 'Make an Offer',
  listing: 'New Listing'
}

const titles = {
  offer: 'Choose Contract Type',
  listing: 'Choose Listing Type'
}

export default ({
  type,
  onClickOption
}) => (
  <Dropdown id="deal-create-offer" pullRight>
    <Dropdown.Toggle className="create-deal" noCaret>
      { names[type] }
    </Dropdown.Toggle>

    <Dropdown.Menu className="create-deal-list">
      <li className="title">{ titles[type] }</li>
      {
        options[type].map((item, key) =>
          <MenuItem
            key={`MENU_ITEM_${key}`}
            onClick={() => onClickOption(type, item)}
            eventKey={key+1}
          >
            { item }
          </MenuItem>
        )
      }
    </Dropdown.Menu>
  </Dropdown>
)
