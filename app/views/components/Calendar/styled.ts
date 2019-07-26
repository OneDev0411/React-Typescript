import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  height: 3rem;
  border-bottom: 1px solid RebeccaPurple;
  margin-bottom: 1rem;
`

export const Sidebar = styled.div`
  flex: 2;
  background: #eee;
  padding: 0.5rem;
`

export const SideHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.9rem;
  margin-bottom: 1rem;
`

export const Title = styled.div`
  font-size: 1.3rem;
  font-weight: 500;
`

export const Main = styled.div`
  flex: 8;
`
