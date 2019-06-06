import styled from 'styled-components'

import { dimmerOverlayColor, grey } from 'views/utils/colors'
import OriginalUserAvatar from 'components/UserAvatar'

export const TeamMemberItem = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  padding: 0.85rem;
  border: 1px solid ${grey.A300};
  :not(:last-child) {
    border-bottom: none;
  }
`

export const TeamMemberTitle = styled.div`
  font-weight: 500;
`

export const TeamMemberSubTitle = styled.div`
  color: ${grey.A900};
`

export const UserAvatar = styled(OriginalUserAvatar)`
  margin-right: 0.85rem;
`
export const DeactivatedOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  background: ${dimmerOverlayColor};
  left: 0;
  right: 0;
  pointer-events: none;
`
