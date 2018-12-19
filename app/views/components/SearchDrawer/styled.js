import styled from 'styled-components'

export const ListContainer = styled.div`
  max-height: calc(100vh - 10.46rem);
  overflow: auto;

  ${props =>
    props.asDropDown &&
    `
    position: absolute;
    padding: 1rem 0;
    max-height: 300px;
    z-index: 1;
    right: 0;
    left: 0;
    border-radius: 3px;
    box-shadow: 0 1px 12px 0 rgba(0, 0, 0, 0.2);
    margin-top: -1rem;
    background-color: #fff;

    .c-search-listings__mls-item {
      padding-right: 0.5rem !important;
      padding-left: 0.5rem !important;
    }
  `};
`

export const ListTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 0.875rem;
`
