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
  height: 3.875rem;
  background-color: #f6f6f6;
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
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #f5f5f5;
`

export const Body = styled.div`
  ${RowItem}:last-child {
    border-bottom: none;
  }
`

export const AgentTitle = styled(LinkButton)`
  line-height: inherit;
  height: auto;
  font-size: 1rem;
  font-weight: 500;
  padding: 0;
  margin: 0;
`
