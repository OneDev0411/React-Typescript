import styled from 'styled-components'

import { grey } from 'views/utils/colors'

import LinkButton from 'components/Button/LinkButton'

export const Card = styled.div`
  border: solid 1px ${grey.A300};
  border-radius: 3px;
  margin-bottom: 1rem;
`

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${grey.A125};
  padding: 0.5rem 1rem;
  border-radius: 3px 3px 0 0;
  border-bottom: solid 1px ${grey.A300};
`

export const Title = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #000;
`

export const SubTitle = styled.div`
  opacity: 0.5;
  font-size: 0.875rem;
  color: #000;
`

export const RowItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  transition: 0.1s ease-in background-color;

  :not(:last-child) {
    border-bottom: 1px solid ${grey.A300};
  }

  :hover {
    cursor: pointer;
    background-color: ${grey.A125};
  }
`

export const AgentTitle = styled(LinkButton)`
  line-height: inherit;
  height: auto;
  font-size: 1rem;
  font-weight: 500;
  padding: 0;
  margin: 0;
  color: #262626;
`

export const AgentEmail = styled(SubTitle)`
  font-size: 1rem;
`
