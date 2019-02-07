import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
`

export const BadgeCounter = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6a623;
  top: -12px;
  right: -6px;
  font-size: 13px;
  color: #fff;
  border-radius: 100%;
  padding: 0 3px;
  min-width: 1.3rem;
  min-height: 1.3rem;

  ${props =>
    props.isRectangle &&
    `
  
    border-radius: 3px;
    padding: 0 5px;
  `}
`
