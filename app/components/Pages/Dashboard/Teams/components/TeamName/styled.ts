import styled, { keyframes } from 'styled-components'

import Flex from 'styled-flex-component'

import ALink from 'components/ALink'
import { primary } from 'views/utils/colors'
import IconButton from 'components/Button/IconButton'
import Badge from 'components/Badge'
import UserIcon from 'components/SvgIcons/InPerson/IconInPerson'

import { saleInAnimation } from '../../../../../../animations/scale-in'

export const TeamLink = styled(ALink)`
  &.active {
    color: ${primary};
  }
  &:active,
  &:focus {
    outline: none;
  }
`
export const TeamLinkWrapper = styled(Flex)`
  ${IconButton} {
    display: none;
  }
  &:hover ${IconButton} {
    display: flex;
  }
`

export const TeamUserBadge = styled(Badge)`
  margin-left: 0.4rem;
  padding: 0.1rem 0.3rem;
  animation: ${saleInAnimation} 50ms ease forwards;
  ${UserIcon} {
    vertical-align: bottom;
    width: 1rem;
    height: 1rem;
    margin-right: 0.1rem;
    fill: currentColor;
  }
  @key-frames scale-up {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
`
