import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { getBrandAgents } from 'views/utils/brand-members'

import MultiSelectDropdown from '../MultiSelectDropdown'

class UserFilter extends React.Component {
  componentDidMount() {
    this.init()
  }

  init = () => {}

  get MembersList() {
    const selectedItems = this.SelectedItems

    return _.chain(this.Members)
      .uniq(member => member.id)
      .map(member => {
        let name = member.display_name

        if (member.id === this.props.user.id) {
          name += ' (you)'
        }

        return {
          label: name,
          value: member.id,
          disabled:
            selectedItems.includes(member.id) && selectedItems.length === 1
        }
      })
      .value()
  }

  get SelectedItems() {
    if (this.props.filter.length > 0) {
      return this.props.filter
    }

    return [this.props.user.id]
  }

  get Members() {
    return this.props.brandMembers || []
  }

  get DropdownTitle() {
    let names = []

    if (this.SelectedItems.length === this.MembersList.length) {
      names = ['Everyone on Team']
    } else {
      names = this.SelectedItems.map(userId => {
        const user = this.Members.find(member => member.id === userId)

        if (!user) {
          return null
        }

        let name = user.display_name

        if (user.id === this.props.user.id) {
          name += ' (only Mine)'
        }

        return name
      })
    }

    let filterName = `Owner is: ${names
      .filter(name => name !== null)
      .join(', ')}`

    return filterName.length < 35
      ? filterName
      : `${filterName.substring(0, 35)}...`
  }

  handleOnChange = selectedItems => {
    if (selectedItems.length === 0) {
      selectedItems = [this.props.user.id]
    }

    this.props.onChange(selectedItems)
  }

  render() {
    if (this.Members.length <= 1) {
      return false
    }

    return (
      <MultiSelectDropdown
        title={this.DropdownTitle}
        defaultSelectedItems={this.SelectedItems}
        forcedSelectedItemsOnDeselectAll={[this.props.user.id]}
        selectAllButton={{
          label: 'Everyone on Team'
        }}
        fullWidth
        items={this.MembersList}
        onChange={this.handleOnChange}
        style={{
          maxWidth: '20rem',
          height: '100%'
        }}
      />
    )
  }
}

function mapStateToProps({ user }) {
  return {
    user,
    brandMembers: getBrandAgents(user)
  }
}

const defaultProps = {
  filter: []
}

UserFilter.defaultProps = defaultProps

export default connect(mapStateToProps)(UserFilter)
