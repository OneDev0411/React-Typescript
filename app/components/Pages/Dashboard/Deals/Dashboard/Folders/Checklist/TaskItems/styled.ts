import styled from 'styled-components'

import LinkButton from 'components/Button/LinkButton'
import { grey } from 'views/utils/colors'

export const Container = styled.div`
  justify-content: space-between;
  align-items: center;
`

export const ItemContainer = styled.div`
  width: 100%;
  background-color: #f7f7f7;

  :hover {
    background-color: #f2f2f2;
  }
`

export const ItemTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
`

export const ItemDate = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${grey.A900};
`

export const ItemLink = styled(LinkButton)`
  color: #000;
  font-size: 1rem;
  font-weight: 500;
  padding: 0 1rem 0 0;
  margin: 0;
  white-space: normal;
  line-height: 1.8;
`

export const ItemRow = styled.div`
  display: flex;
  flex-direction: column;

  border-bottom: solid 1px #e6e6e6;
  padding: 0.825rem 1rem;
  padding-left: 3rem;
`
