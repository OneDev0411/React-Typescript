import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { grey } from '../../../../utils/colors'

export const FormContainer = styled.form`
  width: 100%;
  padding: 1.5em;

  /* &:hover {
    cursor: pointer;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  } */
`
export const FieldContainer = Flex.extend`
  height: 40px;
  border-radius: 3px;
  background-color: ${grey.A150};
`
