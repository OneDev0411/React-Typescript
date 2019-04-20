import styled from 'styled-components'

import { grey, brandBackground } from 'views/utils/colors'

const Container = styled.div`
  margin: 0 -0.5em 0.5em;
  padding: 0.5em;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    border-radius: 3px;
    background-color: ${brandBackground};

    .stop {
      visibility: visible;
    }
  }

  .title {
    font-weight: 600;
    margin-bottom: 0.5em;
    width: calc(100% - 1rem);
  }

  .status {
    width: 1.5em;
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

  .next-step-icon {
    fill: ${grey.A900};
    margin-right: 0.25em;
  }

  > .next-step-counter {
    padding-left: 2em;
    font-size: 0.875rem;
    font-weight: 500;
    color: ${grey.A900};
  }

  .stop {
    width: 1.5em;
    height: 1.5em;
    visibility: hidden;
  }

  .stop__icon {
    width: 1.125em;
    height: 1.125em;
    border-radius: 100%;
    border: 2px solid #000;

    &:after {
      content: '';
      width: 0.4em;
      height: 0.4em;
      border-radius: 2px;
      background-color: #000;
    }
  }
`

export default Container
