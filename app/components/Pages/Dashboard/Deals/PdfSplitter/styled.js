import styled from 'styled-components'

import Card from 'components/Card'

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f2f2f2;
  z-index: 1004;
  overflow: auto;
  padding: 0 2rem;
  box-shadow: -1px 0 2px 0 rgba(0, 0, 0, 0.04), -1px 0 20px 0 rgba(0, 0, 0, 0.1);
`

export const SectionCard = styled(Card)`
  padding: 0.5rem;
  min-height: 80vh;
`

export const PageNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  opacity: 0.5;
  border-radius: 3px;
  border: 1px solid #b3b3b3;
  margin-right: 0.5rem;
`

export const Header = styled.div`
  position: sticky;
  background-color: #fff;
  top: 0;
  z-index: 1;
`
