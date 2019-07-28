import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
  padding: 0 0.5rem;
  border-bottom: 1px solid #eff1f2;
  margin-bottom: 1rem;
`

export const Sidebar = styled.div`
  width: 18rem;
  background: #ebeff2;
  padding: 1rem 0.5rem;
`

export const SideHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  margin-bottom: 1rem;
`

export const Title = styled.div`
  font-weight: 900;
  font-size: 1.2rem;
  line-height: 2rem;
  color: #1f2e4d;
`

export const Main = styled.div`
  width: calc(100% - 18rem);
`
