import styled from 'styled-components'

export const MenuItem = styled.div.attrs({ role: 'button' })`
  overflow: hidden;
  font-size: 1rem;
  box-sizing: border-box;
  min-height: 4rem;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 400;
  line-height: 3.5;
  white-space: nowrap;
  letter-spacing: 0.00938em;
  padding: 0.25rem 1rem;
  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
`
