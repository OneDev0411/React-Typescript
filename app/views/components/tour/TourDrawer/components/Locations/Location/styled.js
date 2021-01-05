import styled from 'styled-components'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { grey, borderColor, primary } from '../../../../../../utils/colors'
import { LatoFamilyStyle } from '../../../../../Typography/styles'

export const CloseIcon = styled(SvgIcon)`
  color: ${grey.A900} !important;
`

export const Container = styled.div`
  &:hover {
    cursor: move;
    background-color: ${grey.A100};

    ${CloseIcon} {
      color: #000 !important;
    }
  }
`

export const Listing = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.75em;
  border-radius: 3px;
  border-top: 1px solid ${borderColor};
`

export const Title = styled.div`
  ${LatoFamilyStyle};
  font-size: 0.875rem;

  &:hover {
    color: ${primary};
  }
`

export const Details = styled.div`
  font-size: 0.875rem;
  color: ${grey.A900};
`
