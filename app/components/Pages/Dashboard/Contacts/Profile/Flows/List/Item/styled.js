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

  .next-step-icon {
    fill: ${grey.A900};
    margin-right: 0.25em;
  }

  .upcoming {
    font-weight: 600;
    color: ${grey.A600};
    padding-left: 1.5rem;
  }

  .missed-steps {
    padding-left: 1.5rem;
    margin-top: 0.5rem;
  }

  .small-text {
    font-size: 0.875rem;
    line-height: 1.71;
  }

  .next-step__icon {
    width: 1em;
    height: 1em;
    margin-right: 0.5em;
  }

  .next-step__detail {
    width: calc(100% - 1.5em);
  }
`

export default Container
