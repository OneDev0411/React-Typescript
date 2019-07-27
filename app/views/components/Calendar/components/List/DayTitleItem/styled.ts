import styled from 'styled-components'

interface IContainer {
  backgroundColor: string
}

export const Container = styled.div<IContainer>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  border-radius: 4px;
  transition: 0.2 ease-in backgroundColor;
  background-color: ${props => props.backgroundColor};
  width: 100%;
  height: 32px;
`
