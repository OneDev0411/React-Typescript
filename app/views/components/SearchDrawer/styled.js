import styled from 'styled-components'

export const ResultsContainer = styled.div`
  max-height: calc(100vh - (56px + 50px + 30px));
  overflow: auto;
`

export const ErrorMessage = styled.div`
  color: #f6a623;
  background: rgba(245, 166, 35, 0.05);
  border: 1px solid rgba(245, 166, 35, 0.2);
  padding: 1rem;
  font-size: 1.4rem;
  line-height: 1.5;
  border-radius: 3px;
  margin: 0 16px;

  ${props =>
    props.type === 'error' &&
    `
      background: rgba(255, 0, 0, 0.05);
      border-color: rgba(255, 0, 0, 0.2);
      color: rgba(255, 0, 0, 0.8);
  `};
`
