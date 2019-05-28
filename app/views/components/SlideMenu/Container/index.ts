import styled from 'styled-components'

interface Props {
  isOpen
}

export const Container = styled.div<Props>`
  position: relative;
  display: flex;
  flex-direction: row;
  will-change: overflow;
  backface-visibility: hidden;
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  box-shadow: ${props =>
    props.isOpen
      ? 'none'
      : '-1px 0 2px 0 rgba(0, 0, 0, 0.04), -1px 0 20px 0 rgba(0, 0, 0, 0.1)'};
`
