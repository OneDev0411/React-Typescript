import styled from 'styled-components'
import { borderColor, error } from '../../../../../utils/colors'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75em 1em;
  border-bottom: 1px solid ${borderColor};
`

export const Title = styled.label`
  font-weight: normal;
  cursor: pointer;

  &::after {
    content: '${props => (props.required ? '*' : '')}';
    display: inline-block;
    margin-left: 0.5em;
    font-weight: bold;
    color: ${error};
  }
`
