import styled, { css } from 'styled-components'

import { primary } from 'views/utils/colors'

export const PageNumber = styled.div`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: rgba(0, 0, 0, 0.8);
  text-decoration: underline;
  text-align: center;
`

export const Container = styled.div`
  position: relative;

  canvas {
    display: block;
    margin: 0 auto;
    width: 85%;
    border: solid 1px #e6e6e6;
    ${props =>
      props.isLoading &&
      css`
        filter: blur(2px);
      `};
  }

  svg {
    position: absolute;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;

    top: 45%;
    transform: translateY(-50%);

    fill: ${primary};
    z-index: 1;
  }

  font-weight: 500;
  margin: 1rem;
`
