import styled from 'styled-components'

import { grey } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
  margin-bottom: 1.5rem;
  justify-content: center;
  background-color: ${grey.A100};

  &:last-child {
    margin-right: 0;
  }

  > img {
    width: 14rem;
  }
`
