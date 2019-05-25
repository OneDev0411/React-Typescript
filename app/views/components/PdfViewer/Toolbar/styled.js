import styled from 'styled-components'

import { grey, primary } from 'views/utils/colors'

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
  width: 100%;
  border-radius: 3px;
  background-color: ${grey.A150};
  position: sticky;
  top: 0;
  z-index: 1;
`

export const MenuItem = styled.div`
  margin: 0.5rem 0.75rem;
  cursor: pointer;

  i {
    color: ${grey.A900};
    font-size: 1.5rem;

    :hover {
      color: ${primary};
    }
  }
`
