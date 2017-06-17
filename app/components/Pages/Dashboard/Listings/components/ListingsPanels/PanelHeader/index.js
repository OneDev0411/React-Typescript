import React from 'react'
import { Button, DropdownButton, MenuItem } from 'react-bootstrap'
import Brand from '../../../../../../../controllers/Brand'

const getBrandColor = () => Brand.color('primary', '3388ff')
const getText = node => node.target.text.toLowerCase()

const ButtonStyle = {
  backgroundColor: `#${getBrandColor()}`
}

const PanelHeader = ({
  info,
  onClickMenuItem = type => {
    console.log(type)
  },
  onClickShare,
  activeSorting = 'Most Relevant'
}) =>
  <div className="c-panel__header">
    <p className="c-panel__header__title">
      {info.count
        ? <span><strong>{info.count}</strong> {` of ${info.total} Homes`}</span>
        : <span>0 Homes</span>}
    </p>
    <div className="c-panel__header__sorting">
      <span className="c-panel__header__sorting__title">
        Sorting by
      </span>
      <span className="c-panel__header__sorting__dropdown-wrapper">
        <DropdownButton
          noCaret
          bsStyle="link"
          title={activeSorting}
          className="c-panel__header__sorting__dropdown">
          <MenuItem onClick={e => onClickMenuItem(getText(e))}>
            Area
          </MenuItem>
          <MenuItem onClick={e => onClickMenuItem(getText(e))}>Price</MenuItem>
          <MenuItem onClick={e => onClickMenuItem(getText(e))}>
            Beds
          </MenuItem>
          <MenuItem onClick={e => onClickMenuItem(getText(e))}>
            Baths
          </MenuItem>
          <MenuItem onClick={e => onClickMenuItem(getText(e))}>
            Sqft
          </MenuItem>
          <MenuItem onClick={e => onClickMenuItem(getText(e))}>
            $/Sqft
          </MenuItem>
          <MenuItem onClick={e => onClickMenuItem(getText(e))}>
            Built
          </MenuItem>
          <MenuItem onClick={e => onClickMenuItem(getText(e))}>Dom</MenuItem>
          <MenuItem onClick={e => onClickMenuItem(getText(e))}>
            Distance to map center
          </MenuItem>
        </DropdownButton>
        <span className="c-panel__header__sorting__dropdown-caret">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="7"
            viewBox="0 0 12 7">
            <path
              fill="#2196F3"
              d="M10.725.12a.38.38 0 0 1 .553 0l.602.601a.38.38 0 0 1 0 .553L6.277 6.878a.38.38 0 0 1-.554 0L.12 1.275a.38.38 0 0 1 0-.553L.721.12a.38.38 0 0 1 .553 0L6 4.846 10.725.12z"
            />
          </svg>
        </span>
      </span>
    </div>
    <Button
      bsStyle="primary"
      onClick={onClickShare}
      style={ButtonStyle}
      className="c-panel__header__button">
      save search
    </Button>
  </div>

export default PanelHeader
