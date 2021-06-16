import styled from 'styled-components'
import { Theme } from '@material-ui/core'
import Flex from 'styled-flex-component'

interface Props {
  theme: Theme
}

export const FormContainer = styled.form`
  width: 100%;
  padding: 1.5em 0 6rem;
`
export const FieldContainer = styled(Flex)`
  height: 2.5rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }: Props) => theme.palette.divider};
`

export const AssociationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: ${({ theme }: Props) => theme.spacing(0.25)}px;
  min-height: 40px;
  border: 1px solid ${({ theme }: Props) => theme.palette.divider};
  border-radius: ${({ theme }: Props) => theme.shape.borderRadius}px;
`

export const Footer = styled(Flex)`
  position: absolute;
  bottom: 0;
  left: 1.5rem;
  right: 0;
  width: calc(100% - 3rem);
  height: 4.5rem;
  background-color: #fff;
  border-top: 1px solid ${({ theme }: Props) => theme.palette.divider};
  z-index: 1;
`
