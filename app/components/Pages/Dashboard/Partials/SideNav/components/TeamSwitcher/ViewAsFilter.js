import React from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import {
  viewAs,
  isBackOffice,
  getActiveTeam,
  allMembersOfTeam
} from '../../../../../../../utils/user-teams'
import { grey, borderColor } from '../../../../../../../views/utils/colors'

import { setViewAsFilter } from '../../../../../../../store_actions/user/set-view-as-filter'

import { CheckBoxButton } from '../../../../../../../views/components/Button/CheckboxButton'

class ViewAsFilter extends React.Component {
  constructor(props) {
    super(props)

    let viewAsList = viewAs(props.user)

    if (
      viewAsList.length === 0 ||
      viewAsList.length === props.brandMembers.length
    ) {
      viewAsList = props.brandMembers.map(m => m.id)
    }

    this.state = {
      viewAsList
    }
  }

  handleViewAs = async e => {
    const viewAs = e.currentTarget.dataset.viewAs
    const { brandMembers } = this.props

    this.setState(({ viewAsList }) => {
      if (viewAs === 'All') {
        viewAsList =
          viewAsList.length !== brandMembers.length
            ? this.props.brandMembers.map(m => m.id)
            : []
      } else if (viewAsList.indexOf(viewAs) > -1) {
        viewAsList = viewAsList.filter(f => f !== viewAs)
      } else {
        viewAsList = [...viewAsList, viewAs]
      }

      return { viewAsList }
    }, this.setViewAsSetting)
  }

  setViewAsSetting = _.debounce(() => {
    const viewAsList = viewAs(this.props.user)
    const currentUserFilterLength = viewAsList.length
    const nextUserFilterLength = this.state.viewAsList.length
    const activeTeamMemberCount = this.props.brandMembers.length

    if (
      (currentUserFilterLength === 0 ||
        currentUserFilterLength === activeTeamMemberCount) &&
      (nextUserFilterLength === 0 ||
        nextUserFilterLength === activeTeamMemberCount)
    ) {
      return
    }

    this.props.dispatch(setViewAsFilter(this.props.user, this.state.viewAsList))
  }, 500)

  render() {
    const { viewAsList } = this.state
    const { isActive, brandMembers } = this.props
    const rowStyle = { height: '2.5rem', padding: '0 1rem' }

    if (isBackOffice(this.props.user) || !isActive) {
      return null
    }

    return (
      <div
        style={{
          maxHeight: '15.1rem',
          overflowY: 'auto',
          background: grey.A000,
          borderTop: `1px solid ${borderColor}`
        }}
        className="u-scrollbar--thinner--self"
      >
        <div style={{ padding: '0.5rem 1rem 0' }}>View as</div>
        {brandMembers.length > 1 && (
          <React.Fragment>
            <Flex alignCenter style={rowStyle}>
              <CheckBoxButton
                square
                data-view-as="All"
                isSelected={viewAsList.length === brandMembers.length}
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
          </React.Fragment>
        )}
        {brandMembers.map((member, index) => (
          <Flex alignCenter key={index} style={rowStyle}>
            <CheckBoxButton
              square
              data-view-as={member.id}
              isSelected={viewAsList.indexOf(member.id) > -1}
              onClick={this.handleViewAs}
              style={{ marginRight: '0.5rem' }}
            />
            {`${member.first_name} ${member.last_name}${
              member.id === this.props.user.id ? ' (you)' : ''
            }`}
          </Flex>
        ))}
      </div>
    )
  }
}

function mapStateToProps({ user }) {
  return {
    user,
    brandMembers: allMembersOfTeam(getActiveTeam(user))
  }
}

export default connect(mapStateToProps)(ViewAsFilter)
