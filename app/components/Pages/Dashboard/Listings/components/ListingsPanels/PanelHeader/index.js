import React from 'react'
import { connect } from 'react-redux'

import { confirmation } from '../../../../../../../store_actions/confirmation'

import { Button, Checkbox, DropdownButton, MenuItem } from 'react-bootstrap'
import Brand from '../../../../../../../controllers/Brand'

const getText = node => node.target.text.toLowerCase()

class PanelHeader extends React.Component {
  handleSaveSearch = () => {
    if (this.props.info.total < 400) {
      return this.props.onClickShare()
    }

    this.props.dispatch(
      confirmation({
        confirmLabel: 'Ok',
        description:
          'Please zoom in or set more filters. You can save max 400 listings.',
        hideCancelButton: true,
        message: 'Too many matches!'
      })
    )
  }

  render() {
    const {
      info,
      tabName,
      activePanel,
      sortingIndex,
      onClickDropdownItem
    } = this.props

    return (
      <div className="c-panel__header">
        {tabName !== 'alerts' && (
          <div>
            <p className="c-panel__header__title">
              {info.count ? (
                <span>
                  <strong>{info.count}</strong> {` of ${info.total} Homes`}
                </span>
              ) : (
                <span>0 Homes</span>
              )}
            </p>

            <div className="c-panel__header__sorting">
              <span className="c-panel__header__sorting__title">
                Sorting by
              </span>
              <span className="c-panel__header__sorting__dropdown-wrapper">
                <DropdownButton
                  noCaret
                  bsStyle="link"
                  title={
                    sortingIndex.charAt(0).toUpperCase() +
                    sortingIndex.substr(1)
                  }
                  id="listings-sort-dropdown"
                  className="c-panel__header__sorting__dropdown"
                >
                  {sortingIndex !== 'price' && (
                    <MenuItem onClick={e => onClickDropdownItem(getText(e))}>
                      Price
                    </MenuItem>
                  )}
                  {sortingIndex !== 'bedrooms' && (
                    <MenuItem onClick={e => onClickDropdownItem(getText(e))}>
                      Bedrooms
                    </MenuItem>
                  )}
                  {sortingIndex !== 'baths' && (
                    <MenuItem onClick={e => onClickDropdownItem(getText(e))}>
                      Baths
                    </MenuItem>
                  )}
                  {sortingIndex !== 'sqft' && (
                    <MenuItem onClick={e => onClickDropdownItem(getText(e))}>
                      Sqft
                    </MenuItem>
                  )}
                  {sortingIndex !== '$/sqft' && (
                    <MenuItem onClick={e => onClickDropdownItem(getText(e))}>
                      $/Sqft
                    </MenuItem>
                  )}
                  {sortingIndex !== 'built' && (
                    <MenuItem onClick={e => onClickDropdownItem(getText(e))}>
                      Built
                    </MenuItem>
                  )}
                  {activePanel === 'table' &&
                    sortingIndex !== 'Zip Code' && (
                      <MenuItem onClick={e => onClickDropdownItem('Zip Code')}>
                        Zip Code
                      </MenuItem>
                    )}
                  {activePanel === 'map' &&
                    sortingIndex !== 'distance' && (
                      <MenuItem onClick={e => onClickDropdownItem('distance')}>
                        Distance to map center
                      </MenuItem>
                    )}
                </DropdownButton>
              </span>
              <Checkbox
                onClick={this.props.onClickSortingDirection}
                className="c-panel__header__sorting__checkbox"
              >
                Reverse
              </Checkbox>
            </div>

            {this.props.isLoggedIn &&
              tabName === 'search' && (
                <Button
                  bsStyle="primary"
                  onClick={this.handleSaveSearch}
                  style={{
                    backgroundColor: `#${Brand.color('primary', '3388ff')}`
                  }}
                  className="c-panel__header__button"
                >
                  Save Search
                </Button>
              )}
          </div>
        )}

        {activePanel === 'table' && (
          <table
            className="c-tableview__table"
            style={{ marginTop: tabName !== 'alerts' ? '1.7rem' : 0 }}
          >
            <thead className="c-tableview__table__header">
              <tr>
                <th style={{ paddingLeft: '1rem', width: '29%' }}>Address</th>
                <th style={{ width: '14%' }}>Price</th>
                <th style={{ width: '7%' }}>Beds</th>
                <th style={{ width: '7%' }}>Baths</th>
                <th style={{ width: '10%' }}>Sqft</th>
                <th style={{ width: '10%' }}>$/Sqft</th>
                <th style={{ width: '10%' }}>Built Year</th>
                <th style={{ width: '10%' }}>Zip Code</th>
              </tr>
            </thead>
          </table>
        )}
      </div>
    )
  }
}

export default connect()(PanelHeader)
