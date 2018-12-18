import React from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import {
  isBackOffice,
  getActiveTeamId,
  getActiveTeam
} from '../../../../../../../utils/user-teams'
import { grey, borderColor } from '../../../../../../../views/utils/colors'

import { getBrandMembers } from '../../../../../../../store_actions/user/get-brand-members'
import { setViewAsFilter } from '../../../../../../../store_actions/user/set-view-as-filter'

import { CheckBoxButton } from '../../../../../../../views/components/Button/CheckboxButton'

class ViewAsFilter extends React.Component {
  state = {
    viewAsList:
      this.props.team.settings &&
      Array.isArray(this.props.team.settings.user_filter)
        ? this.props.team.settings.user_filter
        : []
  }

  componentDidMount() {
    this.init()
  }

  init = () => {
    if (this.props.brandMembers.length > 0) {
      return
    }

    const brandId = getActiveTeamId(this.props.user)

    this.props.dispatch(getBrandMembers(brandId))
  }

  handleViewAs = async e => {
    const viewAs = e.currentTarget.dataset.viewAs
    const { brandMembers } = this.props

    if (viewAs === 'All') {
      this.setState(
        state => ({
          viewAsList:
            state.viewAsList.length === brandMembers.length
              ? [this.props.user.id]
              : this.props.brandMembers.map(m => m.id)
        }),
        this.setViewAsSetting
      )
    } else {
      this.setState(state => {
        if (state.viewAsList.indexOf(viewAs) > -1) {
          return { viewAsList: state.viewAsList.filter(f => f !== viewAs) }
        }

        return { viewAsList: [...state.viewAsList, viewAs] }
      }, this.setViewAsSetting)
    }
  }

  setViewAsSetting = _.debounce(() => {
    this.props.dispatch(setViewAsFilter(this.props.user, this.state.viewAsList))
  }, 500)

  render() {
    const { viewAsList } = this.state
    const { isActive, brandMembers } = this.props

    if (isBackOffice(this.props.user) || !isActive || brandMembers.length < 2) {
      return null
    }

    return (
      <div
        style={{
          maxHeight: '12rem',
          overflowY: 'auto',
          background: grey.A000,
          borderTop: `1px solid ${borderColor}`
        }}
        className="u-scrollbar--thinner--self"
      >
        <div style={{ padding: '0.5rem 1rem 0' }}>View as</div>
        <Flex alignCenter style={{ height: '2.5rem', padding: '0 1rem' }}>
          <CheckBoxButton
            square
            isSelected={viewAsList.length === brandMembers.length}
            data-view-as="All"
            onClick={this.handleViewAs}
            style={{ marginRight: '0.5rem' }}
          />
          Everyone on team
        </Flex>
        <div
          style={{
            height: '1px',
            margin: '0.25rem auto',
            padding: '0 1rem',
            width: 'calc(100% - 2rem)',
            backgroundColor: grey.A250
          }}
        />
        {brandMembers.map((member, index) => {
          const isYou = member.id === this.props.user.id

          return (
            <Flex
              alignCenter
              key={index}
              style={{ height: '2.5rem', padding: '0 1rem' }}
            >
              <CheckBoxButton
                square
                isDisabled={
                  isYou &&
                  viewAsList.length === 1 &&
                  viewAsList[0] === member.id
                }
                isSelected={viewAsList.indexOf(member.id) > -1}
                data-view-as={member.id}
                onClick={this.handleViewAs}
                style={{ marginRight: '0.5rem' }}
              />
              {`${member.first_name} ${member.last_name}${
                isYou ? ' (you)' : ''
              }`}
            </Flex>
          )
        })}
      </div>
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

  const indexedMembers = {}

  brandMembers.forEach(m => {
    indexedMembers[m.id] = m
  })

  return {
    user,
    brandMembers: Object.values(indexedMembers)
  }
}

export default connect(mapStateToProps)(ViewAsFilter)
