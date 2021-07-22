import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { scaleInAnimation } from 'animations/scale-in'
import ALink from 'components/ALink'
import Badge from 'components/Badge'
import IconButton from 'components/Button/IconButton'
import UserIcon from 'components/SvgIcons/InPerson/IconInPerson'
import { primary } from 'views/utils/colors'

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
  animation: ${scaleInAnimation} 50ms ease forwards;
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
