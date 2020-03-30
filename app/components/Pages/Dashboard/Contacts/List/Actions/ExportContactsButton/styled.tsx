import styled from 'styled-components'

import { primary, disabledBgColor } from 'views/utils/colors'

export const ItemTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
`
export const ItemDescription = styled.div`
  font-size: 0.8rem;
  padding: 0.3rem 0;
  color: ${disabledBgColor};
`

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  font-family: LatoRegular;
  width: 300px;
  padding: 0.6rem 1rem;
  cursor: pointer;

  &:hover {
    background-color: ${primary};

    svg {
      fill: #fff;
    }

    ${ItemTitle}, ${ItemDescription} {
      color: #fff;
    }
  }
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 1rem;
`
