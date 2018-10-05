import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  background-color: #fff;
  border: solid 1px #d4d4d4;
  margin: 1.5rem 2.5rem;
`

export const TabItem = styled.div`
  margin: 0 4.25rem;
  font-size: 1.25rem;
  padding: 0.6rem 0;
  font-weight: 500;
  color: #7f7f7f;
  cursor: pointer;
  border-bottom: 2px solid transparent;

  ${props =>
    props.isActive &&
    `
  
    color: #003bdf;
    border-bottom-color: #003bdf;
  `};
`
