import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Tooltip from '../tooltip'
import { getUserTitle } from '../../../models/user/helpers'
import Avatar from '../Avatar'

const propTypes = {
  users: PropTypes.array,
  style: PropTypes.object,
  tooltipPlacement: PropTypes.string
}

const defaultProps = {
  users: [],
  style: {},
  tooltipPlacement: 'top'
}

const AvatarContainer = styled.div`
  position: relative;

  &:not(:first-of-type) {
    transform: translateX(${props => props.index}em);
    transition: transform 0.2s ease;
  }
`

const AvatarsContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;

  &:hover ${AvatarContainer}:not(:first-of-type) {
    transform: translateX(0);
  }
`

const Avatars = ({ users, style, tooltipPlacement }) => (
  <React.Fragment>
    {Array.isArray(users) &&
      users.length > 0 && (
        <AvatarsContainer style={style}>
          {users.map((user, index) => {
            const title = getUserTitle(user)

            return (
              <AvatarContainer key={user.id} index={index}>
                <Tooltip placement={tooltipPlacement} caption={title}>
                  <Avatar
                    image={user.profile_image_url}
                    size={32}
                    title={title}
                  />
                </Tooltip>
              </AvatarContainer>
            )
          })}
        </AvatarsContainer>
      )}
  </React.Fragment>
)

Avatar.propTypes = propTypes
Avatar.defaultProps = defaultProps

export default Avatars
