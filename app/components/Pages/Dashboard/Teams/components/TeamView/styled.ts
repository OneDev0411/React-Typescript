import styled from 'styled-components'

import OriginalIconButton from 'components/Button/IconButton'
import AddIcon from 'components/SvgIcons/Add/AddIcon'

import { primary } from 'views/utils/colors'

import AddUserIcon from 'components/SvgIcons/AddUser/AddUserIcon'

import { TeamMemberItem } from '../TeamMember/styled'

export const Container = styled.div`
  padding: 1.5rem;
`

export const AddTeamMemberButton = styled(TeamMemberItem).attrs({
  role: 'button'
})`
  cursor: pointer;
  :hover {
    color: ${primary};
    ${AddUserIcon} {
      background: ${primary};
    }
  }
  ${AddUserIcon} {
    border-radius: 50%;
    fill: #fff;
    width: 2.5rem;
    height: 2.5rem;
    margin-right: 1rem;
    background: #000;
    padding: 0.5rem; // FIXME: update when ehsan updated the icon with normal paddings
    overflow: visible;
  }
`

export const IconButton = styled(OriginalIconButton).attrs({
  iconSize: 'XLarge',
  isFit: true,
  appearance: 'outline'
})`
  margin: 0 0.2rem;
  svg {
    padding: 0.3rem !important;
  }
`
