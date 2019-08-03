import styled from 'styled-components'

import { hexToRgb } from 'utils/hex-to-rgb'

interface ContainerProps {
  backgroundColor: string
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  background-color: rgba(
    ${props => hexToRgb(props.backgroundColor).join(', ')},
    0.2
  );
  margin-right: 1rem;
`
