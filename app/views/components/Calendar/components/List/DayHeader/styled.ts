import styled from 'styled-components'

interface IContainer {
  isActive: boolean | null
}

export const Container = styled.div<IContainer>`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  border-radius: 4px;
  transition: 0.2 ease-in backgroundColor;
  background-color: #${props => (props.isActive ? 'e5ebfe' : 'f5f8fa')};
  color: #${props => (props.isActive ? '3050f2' : '000')};
  width: 100%;
  height: 36px;
`
