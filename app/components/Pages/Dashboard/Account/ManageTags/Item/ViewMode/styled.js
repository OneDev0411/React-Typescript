import styled from 'styled-components'

import BaseDeleteIcon from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'
import { grey } from 'views/utils/colors'

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
`

export const DeleteIcon = styled(BaseDeleteIcon)``

export const Title = styled.span`
  margin-right: 0.5rem;
`
