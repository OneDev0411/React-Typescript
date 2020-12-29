import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { Tooltip } from '@material-ui/core'

import { getUserTitle } from '../../../models/user/helpers'
import { Avatar } from '../Avatar'

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

  ${props =>
    props.avatars.map(
      (u, i) =>
        css`
          &:hover ${AvatarContainer}:nth-of-type(${i + 1}):not(:first-of-type) {
            transform: translateX(-${i * 0.5}em);
          }
        `
    )};
`

const Avatars = ({ users, style, tooltipPlacement }) => (
  <React.Fragment>
    {Array.isArray(users) && users.length > 0 && (
      <AvatarsContainer style={style} avatars={users}>
        {users.map((user, index) => {
          const title = getUserTitle(user)

          return (
            <AvatarContainer key={user.id} index={index}>
              <Tooltip placement={tooltipPlacement} title={title}>
                <Avatar user={user} title={title} />
              </Tooltip>
            </AvatarContainer>
          )
        })}
      </AvatarsContainer>
    )}
  </React.Fragment>
)

Avatars.propTypes = propTypes
Avatars.defaultProps = defaultProps

export default Avatars
