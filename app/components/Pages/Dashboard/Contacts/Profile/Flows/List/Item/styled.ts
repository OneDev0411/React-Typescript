import styled from 'styled-components'

import { brandBackground, green } from 'views/utils/colors'

export const Container = styled.div`
  opacity: ${props => (props['aria-disabled'] ? 0.5 : 1)};
  pointer-events: ${props => (props['aria-disabled'] ? 'none' : 'initial')};

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    border-radius: 3px;
    background-color: ${brandBackground};

    .stop-icon {
      opacity: 1;
    }
  }

  .stop-icon {
    opacity: 0.3;
  }

  .flex-align-center {
    display: flex;
    align-items: center;
  }

  .title {
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
      background-color: ${green.primary};
    }
  }
`
