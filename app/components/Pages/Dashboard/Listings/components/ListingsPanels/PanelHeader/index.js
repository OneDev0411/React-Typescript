import React from 'react'
import { connect } from 'react-redux'

import { confirmation } from '../../../../../../../store_actions/confirmation'

import { DropdownButton, MenuItem } from 'react-bootstrap'
import Button from '../../../../../../../views/components/Button/ActionButton'
import Flex from 'styled-flex-component'
import { CheckBoxButton } from '../../../../../../../views/components/Button/CheckboxButton'

const getText = node => node.target.text.toLowerCase()

class PanelHeader extends React.Component {
  state = { reverse: false }
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

            {activePanel !== 'table' && (
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
                        <MenuItem
                          onClick={() => onClickDropdownItem('Zip Code')}
                        >
                          Zip Code
                        </MenuItem>
                      )}
                    {activePanel === 'map' &&
                      sortingIndex !== 'distance' && (
                        <MenuItem
                          onClick={() => onClickDropdownItem('distance')}
                        >
                          Distance to map center
                        </MenuItem>
                      )}
                  </DropdownButton>
                </span>

                <Flex
                  alignCenter
                  style={{ marginLeft: '4rem' }}
                  onClick={() => {
                    this.setState({ reverse: !this.state.reverse })
                    this.props.onClickSortingDirection()
                  }}
                >
                  <CheckBoxButton
                    square
                    isSelected={this.state.reverse}
                    title="Reverse"
                    style={{ marginRight: '0.5rem' }}
                  />
                  Reverse
                </Flex>
              </div>
            )}

            {this.props.isLoggedIn &&
              tabName === 'search' && (
                <Button
                  onClick={this.handleSaveSearch}
                  className="c-panel__header__button"
                >
                  Save Search
                </Button>
              )}
          </div>
        )}
      </div>
    )
  }
}

export default connect()(PanelHeader)
