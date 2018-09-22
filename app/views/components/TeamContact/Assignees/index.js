import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { isSoloActiveTeam } from '../../../../utils/user-teams'

import { TeamMember } from '../TeamMember'
import Button from '../../Button/TextIconButton'
import AddIcon from '../../SvgIcons/Add/AddIcon'
import { BasicDropdown } from '../../BasicDropdown'

import { getUserTitle, getMembers } from '../helpers'
import { AssigneeItem } from '../AssigneeItem'

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

      this.setState({ isFetching: false, members: members || [] })
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
      title: getUserTitle(member),
      value: member
    }))

    return (
      <Flex column>
        <BasicDropdown
          {...this.props}
          items={items}
          isFetching={isFetching}
          onChange={this.props.onChangeHandler}
          itemToString={getUserTitle}
          style={{ marginBottom: '1em', display: 'inline-flex' }}
          buttonRenderer={buttonProps => (
            <Button
              {...buttonProps}
              iconLeft={AddIcon}
              text="Assignee"
              appearance="link"
              size="medium"
              style={{ padding: '0.5em 0', fontWeight: 500 }}
            />
          )}
          itemRenderer={({ item, ...itemProps }) => (
            <TeamMember
              {...itemProps}
              user={item.value}
              title={item.title}
              key={item.value.id}
              selected={
                Array.isArray(this.props.assignees) &&
                this.props.assignees.some(a => a.id === item.value.id)
              }
            />
          )}
        />
        {this.props.assignees.length > 0 && (
          <Flex wrap>
            {this.props.assignees.map(user => (
              <AssigneeItem
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

Assignees.propTypes = propTypes
