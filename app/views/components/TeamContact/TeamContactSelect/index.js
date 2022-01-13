import React from 'react'

import { mdiChevronDown } from '@mdi/js'
import uniqBy from 'lodash/uniqBy'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getUserTitle } from '../../../../models/user/helpers'
import { isSoloActiveTeam } from '../../../../utils/user-teams'
import { Avatar } from '../../Avatar'
import { BasicDropdown } from '../../BasicDropdown'
import ActionButton from '../../Button/ActionButton'
import { getMembers } from '../helpers'
import { TeamMember } from '../TeamMember'

import { ButtonText } from './styled'

const propTypes = {
  onSelect: PropTypes.func.isRequired,
  owner: PropTypes.shape().isRequired,
  user: PropTypes.shape().isRequired,
  buttonRenderer: PropTypes.func
}

const defaultProps = {
  buttonRenderer() {
    return null
  }
}

class TeamContactSelectPresentational extends React.Component {
  constructor(props) {
    super(props)

    this.isSolo = isSoloActiveTeam(props.activeTeam)

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
    const { activeTeam } = this.props

    try {
      this.setState({ isFetching: true })

      const members = await getMembers(activeTeam?.brand.id)

      if (Array.isArray(members)) {
        this.setState({
          isFetching: false,
          members: members ? uniqBy(members, 'id') : []
        })
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
        selectedItem={{ label: getUserTitle(owner), value: owner }}
        buttonRenderer={({
          isBlock,
          noBorder,
          isOpen,
          selectedItem,
          ...buttonProps
        }) => {
          const renderedButton = this.props.buttonRenderer({
            isBlock,
            noBorder,
            isOpen,
            selectedItem,
            ...buttonProps
          })

          if (renderedButton) {
            return renderedButton
          }

          const title = selectedItem.label

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
              <Flex alignCenter style={{ width: '100%' }}>
                <Avatar
                  alt={title}
                  url={selectedItem.value.profile_image_url}
                />
                <ButtonText>{title}</ButtonText>
              </Flex>
              <SvgIcon path={mdiChevronDown} rotate={isOpen ? 180 : 0} />
            </ActionButton>
          )
        }}
        menuStyle={{
          maxWidth: '100%'
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

TeamContactSelectPresentational.propTypes = propTypes
TeamContactSelectPresentational.defaultProps = defaultProps

export const TeamContactSelect = connect(({ activeTeam = null }) => ({
  activeTeam
}))(TeamContactSelectPresentational)
