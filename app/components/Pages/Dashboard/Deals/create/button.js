import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'

const options = [
  'Resale',
  'New Home',
  'Lot / Land',
  'Residential Lease',
  'Commercial Sale',
  'Commercial Lease'
]

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
        options.map((item, key) =>
          <MenuItem
            key={`MENU_ITEM_${key}`}
            onClick={() => onClickOption(item)}
            eventKey={key+1}
          >
            { item }
          </MenuItem>
        )
      }
    </Dropdown.Menu>
  </Dropdown>
)
