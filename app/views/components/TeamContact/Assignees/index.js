import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import uniqBy from 'lodash/uniqBy'
import { Button } from '@material-ui/core'

import { isSoloActiveTeam } from '../../../../utils/user-teams'
import { getUserTitle } from '../../../../models/user/helpers'

import { TeamMember } from '../TeamMember'

import { BasicDropdown } from '../../BasicDropdown'

import { getMembers } from '../helpers'
import { AssigneeItemInAvatar } from '../AssigneeItemInAvatar'

const propTypes = {
  assignees: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  onRemoveHandler: PropTypes.func.isRequired,
  owner: PropTypes.PropTypes.shape().isRequired
}

export class Assignees extends React.Component {
  constructor(props) {
    super(props)

    this.isSolo = isSoloActiveTeam(props.owner)

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
    try {
      this.setState({ isFetching: true })

      const members = await getMembers(this.props.owner)

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
        <BasicDropdown
          {...this.props}
          upsideDown
          items={items}
          isFetching={isFetching}
          onChange={this.props.onChangeHandler}
          itemToString={getUserTitle}
          style={{ display: 'inline-flex' }}
          buttonRenderer={buttonProps => (
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
      </Flex>
    )
  }
}

Assignees.propTypes = propTypes
