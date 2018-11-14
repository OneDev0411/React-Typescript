import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import MultiSelectDropdown from '../MultiSelectDropdown'
import { getBrandMembers } from '../../../store_actions/user/get-brand-members'
import { getActiveTeamId, getActiveTeam } from '../../../utils/user-teams'

class UserFilter extends React.Component {
  componentDidMount() {
    this.init()
  }

  init = () => {
    if (this.Members.length > 0) {
      return false
    }

    const brandId = getActiveTeamId(this.props.user)

    this.props.getBrandMembers(brandId)
  }

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
    return this.props.brandMembers
  }

  get DropdownTitle() {
    let names = []

    if (this.SelectedItems.length === this.Members.length) {
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
  const activeTeam = getActiveTeam(user)
  const brandMembers =
    activeTeam && activeTeam.brand.roles
      ? activeTeam.brand.roles.reduce(
          (members, role) =>
            role.members ? members.concat(role.members) : members,
          []
        )
      : []

  return {
    user,
    brandMembers
  }
}

const defaultProps = {
  filter: []
}

UserFilter.defaultProps = defaultProps

export default connect(
  mapStateToProps,
  {
    getBrandMembers
  }
)(UserFilter)
