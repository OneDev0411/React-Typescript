import styled from 'styled-components'

export const ListingsContainer = styled.div`
  min-height: 420px;
  max-height: 420px;
  overflow: auto;

  ${props =>
    props.isSearching &&
    `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `};
`

export const Loading = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #26465e;

  i {
    font-size: 35px;
    display: block;
    margin: 0 auto 10px auto;
  }
`

export const Alert = styled.div`
  color: #f6a623;
  background: rgba(245, 166, 35, 0.05);
  border: 1px solid rgba(245, 166, 35, 0.2);
  padding: 1rem;
  font-size: 1.4rem;
  line-height: 1.5;
  border-radius: 3px;
  margin: 10px 16px;
`
