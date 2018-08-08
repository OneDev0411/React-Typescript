import React from 'react'
import Downshift from 'downshift'
import PropTypes from 'prop-types'

import IconSearch from '../../../../../../../views/components/SvgIcons/Search/IconSearch'

import { Icon as ArrowIcon } from '../../../../../../../views/components/BasicDropdown/styled'

import DeleteIcon from '../../../../../../../views/components/SvgIcons/Close/CloseIcon'

import {
  MenuContainer,
  MenuContent,
  MenuButton,
  SearchInputContainer,
  SearchInput,
  List,
  ListItem,
  CallToActions
} from './styled'

class DropDown extends React.Component {
  state = {
    isMenuOpen: false,
    filter: ''
  }

  toggleOpenMenu = () =>
    this.setState(state => ({
      isMenuOpen: !state.isMenuOpen,
      filter: state.isMenuOpen ? '' : state.filter
    }))

  /**
   *
   */
  handleSelectListItem = e => {
    const { value, disabled } = e.target.dataset

    if (disabled === 'true') {
      e.stopPropagation()

      return false
    }

    this.toggleOpenMenu()
    this.props.onChange(value)
  }

  handleUnselectField = e => {
    e.stopPropagation()
    this.props.onChange('')
  }

  render() {
    const { options, selectedField, callToActions } = this.props

    return (
      <Downshift
        isOpen={this.state.isMenuOpen}
        onOuterClick={() => this.setState({ isMenuOpen: false, filter: '' })}
      >
        {({ isOpen }) => (
          <div>
            <MenuContainer>
              <MenuButton
                onClick={this.toggleOpenMenu}
                isPlaceholder={!selectedField.label}
              >
                <div>{selectedField.label || 'Select...'}</div>
                <div>
                  {selectedField.value && (
                    <DeleteIcon
                      onClick={this.handleUnselectField}
                      style={{
                        fill: '#506379',
                        width: '16px',
                        height: '16px',
                        marginBottom: '4px'
                      }}
                    />
                  )}
                  <ArrowIcon
                    isOpen={isOpen}
                    style={{ fill: '#506379', width: '24px', height: '24px' }}
                  />
                </div>
              </MenuButton>
              {isOpen && (
                <MenuContent style={this.props.contentStyle}>
                  {this.props.showSearchInput && (
                    <SearchInputContainer>
                      <IconSearch color="#757575" />
                      <SearchInput
                        autoFocus
                        placeholder="Select a property title"
                        onChange={e =>
                          this.setState({ filter: e.target.value })
                        }
                      />
                    </SearchInputContainer>
                  )}

                  <List
                    showSearchInput={this.props.showSearchInput}
                    showCallToActions={this.props.callToActions !== null}
                  >
                    {options
                      .filter(item =>
                        item.label
                          .toLowerCase()
                          .includes(this.state.filter.toLowerCase())
                      )
                      .map((item, index) => (
                        <ListItem
                          key={index}
                          disabled={item.disabled}
                          selected={item.value === selectedField.value}
                          data-value={item.value}
                          data-disabled={item.disabled}
                          onClick={this.handleSelectListItem}
                        >
                          {item.label}
                        </ListItem>
                      ))}
                  </List>

                  {callToActions && (
                    <CallToActions>{callToActions}</CallToActions>
                  )}
                </MenuContent>
              )}
            </MenuContainer>
          </div>
        )}
      </Downshift>
    )
  }
}

DropDown.propTypes = {
  options: PropTypes.array,
  selectedField: PropTypes.objectOf(PropTypes.string),
  showSearchInput: PropTypes.bool,
  callToActions: PropTypes.element
}

DropDown.defaultProps = {
  options: [],
  selectedField: {
    label: '',
    value: ''
  },
  showSearchInput: true,
  callToActions: null
}

export default DropDown
