import styled from 'styled-components'

import { brandBackground } from 'views/utils/colors'

export const ItemContainer = styled.div`
  margin: 0 -0.5em 0.5em;
  padding: 0.5em;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    border-radius: 3px;
    background-color: ${brandBackground};
  }

  .title {
    font-weight: 600;
    margin-bottom: 0.5em;
    width: calc(100% - 1rem);
  }

  .status {
    width: 1em;
    height: 1.5em;
    margin-right: 0.5em;

    &:after {
      content: '';
      width: 0.5em;
      height: 0.5em;
      border-radius: 100%;
      background-color: #00ae22;
    }
  }
`
