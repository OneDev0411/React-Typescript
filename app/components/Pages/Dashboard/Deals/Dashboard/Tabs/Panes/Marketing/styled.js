import styled from 'styled-components'

import { H3 } from 'components/Typography/headings'

import { Card } from '../../styled'

export const MarketingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1rem;
`

export const Container = styled(Card)`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 1.5rem 3.5rem;
  position: relative;
  overflow: hidden;
`

export const Image = styled.img`
  width: 18rem;
`

export const LeftColumn = styled.div`
  width: 40%;
`

export const RightColumn = styled.div`
  display: flex;
  flex: 1;
  padding-left: 5rem;
  align-items: center;
`

export const Title = styled(H3)`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`

export const Description = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 2rem;
`
