import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export const Container = styled.div`
  color: #4d4d4d;
  border-radius: 12px;
  background-color: #e6e6e6;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 5rem;
  border-radius: 0.75rem;
  margin-right: 0.5rem;
  max-height: 1.5rem;

  ${props =>
    !props.disabled &&
    `
    :hover {
      cursor: pointer;
      color: ${primary};
      text-decoration: underline;
    }
  `}
`
