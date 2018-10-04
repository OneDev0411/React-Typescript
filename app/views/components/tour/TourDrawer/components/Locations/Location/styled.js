import styled from 'styled-components'

import { grey, borderColor, primary } from '../../../../../../utils/colors'
import { merriweatherFamilyStyle } from '../../../../../Typography/styles'
import IconClose from '../../../../../SvgIcons/Close/CloseIcon'

export const CloseIcon = IconClose.extend`
  fill: ${grey.A900} !important;

  &:hover {
    fill: ${primary} !important;
  }
`

export const Container = styled.div`
  margin-bottom: 1em;
  background-color: ${grey.A100};

  &:hover {
    cursor: move;
    background-color: ${grey.A250};

    ${CloseIcon} {
      fill: #000 !important;
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
  ${merriweatherFamilyStyle};
  font-size: 0.875rem;

  &:hover {
    color: ${primary};
  }
`

export const Details = styled.div`
  font-size: 0.875rem;
  color: ${grey.A900};
`
