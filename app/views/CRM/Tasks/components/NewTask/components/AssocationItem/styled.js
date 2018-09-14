import styled from 'styled-components'

import { grey } from '../../../../../../utils/colors'
import { merriweatherFamilyStyle } from '../../../../../../components/Typography/styles'

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 1em;
  margin-bottom: 1em;
  padding: 0.75em;
  border-radius: 3px;
  background-color: ${grey.A100};
`

export const Title = styled.div`
  ${merriweatherFamilyStyle};
  font-size: 0.875rem;
`

export const Details = styled.div`
  font-size: 0.875rem;
  color: ${grey.A900};
`
