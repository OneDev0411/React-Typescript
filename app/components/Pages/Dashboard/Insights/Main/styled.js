import styled from 'styled-components'

import ALink from 'components/ALink'

export const InsightContainer = styled.div`
  & .table-container {
    padding: 0 1.5rem;
    opacity: 0;
    transform: translateY(3rem);
    transition: all 0.5s 0.2s;

    &.show {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

export const Info = styled.div`
  /* width: calc(100% - 40px - 1.5rem); */
  /* margin-left: 1rem; */
  display: flex;
  align-items: center;

  & .sub-info {
    color: #ccc;
    font-size: 0.875rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    margin-right: 0.5rem;
  }

  & .main-info {
  }
`

export const Link = styled(ALink) `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  font-weight: 500;
  margin-top: -4px;
`
