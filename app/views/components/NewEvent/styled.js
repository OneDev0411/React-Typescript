import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { grey, primary } from 'views/utils/colors'
import LinkButton from 'components/Button/LinkButton'

export const FormContainer = styled.form`
  width: 100%;
  padding: 1rem 1rem 0.5rem;
`
export const FieldContainer = styled(Flex)`
  height: 2.5rem;
  border-radius: 3px;
  background-color: ${grey.A150};
`

export const DropButton = styled(LinkButton)`
  font-weight: 500;
  justify-content: space-between;
  background-color: ${grey.A150};
  color: ${({ isOpen }) => (isOpen ? primary : '#000')};

  :hover {
    > svg {
      fill: ${primary};
    }
  }
`
