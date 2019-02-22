import styled, { css } from 'styled-components'

import BaseDeleteIcon from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'
import { grey, blue } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 5.625rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  border-radius: 3px;
  padding: 0.5rem 1rem;
  background-color: ${grey.A100};
  transition: box-shadow 1s ease-in;

  ${({ highlight }) =>
    highlight &&
    css`
      box-shadow: 0 0 0 2px ${blue.A200} inset;
    `}
`

export const DeleteIcon = styled(BaseDeleteIcon)

export const Title = styled.span`
  margin-right: 0.5rem;
`
