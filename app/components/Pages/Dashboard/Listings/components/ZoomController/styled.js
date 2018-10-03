import styled from 'styled-components'

import IconButton from '../../../../../../views/components/Button/IconButton'

export const Container = styled.div`
  display: Flex;
  flex-direction: column;
  position: absolute;
  bottom: ${props => (props.isTopOfLocation ? '4.5em' : '1.5rem')};
  right: 1.5em;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.15),
    0 8px 10px 0 rgba(0, 0, 0, 0.16);
`

export const Button = IconButton.extend`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`
