import React from 'react'
import { connect } from 'react-redux'

import { confirmation } from '../../../../../../../store_actions/confirmation'

import ActionButton from '../../../../../../../views/components/Button/ActionButton'
import Flex from 'styled-flex-component'
import { CheckBoxButton } from '../../../../../../../views/components/Button/CheckboxButton'
import { BasicDropdown } from '../../../../../../../views/components/BasicDropdown'

const Button = ActionButton.extend`
  position: absolute;
  right: 0;
  top: 0;
`

function getItems(items) {
  return items.map(item => ({ label: item, value: item.toLowerCase() }))
}
function itemToString(item) {
  return item.label
}

const baseDropdown = getItems([
  'Price',
  'Bedrooms',
  'Baths',
  'Sqft',
  '$/Sqft',
  'Built'
])

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

    const dropDownItems = [...baseDropdown]

    if (activePanel === 'table') {
      dropDownItems.push({ label: 'Zip Code', value: 'Zip Code' })
    }

    if (activePanel === 'map') {
      dropDownItems.push({ label: 'Distance to map center', value: 'distance' })
    }

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
                <BasicDropdown
                  noBorder
                  maxHeight="unset"
                  style={{ display: 'inline-block' }}
                  items={dropDownItems}
                  itemToString={itemToString}
                  buttonText={sortingIndex || 'Choose a checklist type'}
                  onChange={item => onClickDropdownItem(item.value)}
                />

                <Flex alignCenter style={{ marginLeft: '4rem' }}>
                  <CheckBoxButton
                    square
                    isSelected={this.state.reverse}
                    title="Reverse"
                    style={{ marginRight: '0.5rem' }}
                    onClick={() => {
                      this.setState({ reverse: !this.state.reverse })
                      this.props.onClickSortingDirection()
                    }}
                  />
                  Reverse
                </Flex>
              </div>
            )}

            {this.props.isLoggedIn &&
              tabName === 'search' && (
                <Button onClick={this.handleSaveSearch}>Save Search</Button>
              )}
          </div>
        )}
      </div>
    )
  }
}

export default connect()(PanelHeader)
