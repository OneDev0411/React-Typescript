import styled from 'styled-components'

import { grey } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`

export const Title = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  margin-top: 1rem;
  color: ${grey.A600};
`
