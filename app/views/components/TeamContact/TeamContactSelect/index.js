import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { getUserTitle } from '../../../../models/user/helpers'
import { isSoloActiveTeam } from '../../../../utils/user-teams'

import Avatar from '../../Avatar'
import { TeamMember } from '../TeamMember'
import { BasicDropdown } from '../../BasicDropdown'
import ActionButton from '../../Button/ActionButton'
import { Icon } from '../../Dropdown'

import { getMembers } from '../helpers'

const propTypes = {
  onSelect: PropTypes.func.isRequired,
  owner: PropTypes.shape().isRequired,
  user: PropTypes.shape().isRequired
}

export class TeamContactSelect extends React.Component {
  constructor(props) {
    super(props)

    this.isSolo = isSoloActiveTeam(props.user)

    this.state = {
      isFetching: false,
      members: [props.user]
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

      const members = await getMembers(this.props.user)

      if (Array.isArray(members)) {
        this.setState({ isFetching: false, members })
      } else {
        this.setState({ isFetching: false })
      }
    } catch (error) {
      console.log(error)
      this.setState({ isFetching: false })
      throw error
    }
  }

  render() {
    const { owner } = this.props

    const items = this.state.members.map(member => ({
      label: getUserTitle(member),
      value: member
    }))

    return (
      <BasicDropdown
        {...this.props}
        items={items}
        onSelect={this.props.onSelect}
        isFetching={this.state.isFetching}
        defaultSelectedItem={{ label: getUserTitle(owner), value: owner }}
        buttonRenderer={buttonProps => {
          const title = buttonProps.selectedItem.label

          return (
            <ActionButton
              {...buttonProps}
              appearance="outline"
              size="large"
              inverse
              style={{
                justifyContent: 'space-between',
                fontWeight: 500
              }}
            >
              <Flex alignCenter>
                <Avatar
                  size={32}
                  title={title}
                  image={buttonProps.selectedItem.value.profile_image_url}
                />
                <span style={{ margin: '0 0.5em 0 1em' }}>{title}</span>
              </Flex>
              <Icon
                style={{ marginTop: '0.2em' }}
                isOpen={buttonProps.isOpen}
              />
            </ActionButton>
          )
        }}
        itemRenderer={({ item, ...itemProps }) => {
          const isSelected = owner.id === item.value.id

          return (
            <TeamMember
              {...itemProps}
              user={item.value}
              title={item.label}
              key={item.value.id}
              isDisabled={isSelected}
              isSelected={isSelected}
            />
          )
        }}
      />
    )
  }
}

TeamContactSelect.propTypes = propTypes
