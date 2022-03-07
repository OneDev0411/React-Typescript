import { Component } from 'react'

import { Button } from '@material-ui/core'
import uniqBy from 'lodash/uniqBy'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import { getUserTitle } from '../../../../models/user/helpers'
import { isSoloActiveTeam } from '../../../../utils/user-teams'
import { BasicDropdown } from '../../BasicDropdown'
import { AssigneeItemInAvatar } from '../AssigneeItemInAvatar'
import { getMembers } from '../helpers'
import { TeamMember } from '../TeamMember'

const propTypes = {
  assignees: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  onRemoveHandler: PropTypes.func.isRequired
}

class PresentationalAssignees extends Component {
  constructor(props) {
    super(props)

    this.isSolo = isSoloActiveTeam(props.activeTeam)

    this.state = {
      isFetching: false,
      members: []
    }
  }

  componentDidMount() {
    if (!this.isSolo) {
      this.loadMembers()
    }
  }

  loadMembers = async () => {
    const { activeTeam } = this.props

    try {
      this.setState({ isFetching: true })

      const members = await getMembers(activeTeam?.brand.id)

      this.setState({
        isFetching: false,
        members: members ? uniqBy(members, 'id') : []
      })
    } catch (error) {
      console.log(error)
      this.setState({ isFetching: false })
      throw error
    }
  }

  render() {
    const { members, isFetching } = this.state

    if (this.isSolo) {
      return null
    }

    const items = members.map(member => ({
      label: getUserTitle(member),
      value: member
    }))

    return (
      <Flex alignCenter>
        <BasicDropdown
          {...this.props}
          upsideDown
          items={items}
          isFetching={isFetching}
          onChange={this.props.onChangeHandler}
          itemToString={getUserTitle}
          style={{ marginRight: '0.5rem', display: 'inline-flex' }}
          buttonRenderer={({
            isBlock,
            noBorder,
            isOpen,
            selectedItem,
            ...buttonProps
          }) => (
            <Button
              {...buttonProps}
              size="small"
              color="secondary"
              type="button"
            >
              Add Assignee
            </Button>
          )}
          itemRenderer={({ item, ...itemProps }) => (
            <TeamMember
              {...itemProps}
              user={item.value}
              title={item.label}
              key={item.value.id}
              isSelected={
                Array.isArray(this.props.assignees) &&
                this.props.assignees.some(a => a.id === item.value.id)
              }
            />
          )}
        />
        {this.props.assignees.length > 0 && (
          <Flex>
            {this.props.assignees.map(user => (
              <AssigneeItemInAvatar
                user={user}
                removeHandler={this.props.onRemoveHandler}
                key={user.id}
              />
            ))}
          </Flex>
        )}
      </Flex>
    )
  }
}

PresentationalAssignees.propTypes = propTypes

export const Assignees = connect(({ activeTeam = null }) => ({ activeTeam }))(
  PresentationalAssignees
)
