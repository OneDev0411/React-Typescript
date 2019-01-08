import styled from 'styled-components'
import LinkButton from 'components/Button/LinkButton'

export const Button = styled(LinkButton)`
  padding: 0;
  margin: 0;
  svg {
    margin-right: 0.5rem;
  }
`

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 1rem;
`

export const Title = styled.div`
  font-size: 1rem;
  font-weight: 500;
`
