import { css } from 'styled-components'

export const bodyStyle = {
  display: 'flex',
  flexWrap: 'wrap'
}

export const rowStyle = css`
  width: 100%;
  padding: 0;
  border: none;

  @media screen and (min-width: 64em) {
    width: calc((100% / 2) - 0.5rem);
    margin-right: 1rem;

    &:nth-child(2n) {
      margin-right: 0;
    }
  }

  @media screen and (min-width: 90em) {
    width: calc((100% / 3) - (2rem / 3));

    &:nth-child(2n) {
      margin-right: 1em;
    }

    &:nth-child(3n) {
      margin-right: 0;
    }
  }

  @media screen and (min-width: 110em) {
    width: calc((100% / 4) - 0.75rem);

    &:nth-child(3n) {
      margin-right: 1rem;
    }

    &:nth-child(4n) {
      margin-right: 0;
    }
  }

  @media screen and (min-width: 140em) {
    width: calc((100% / 5) - 0.8rem);

    &:nth-child(4n) {
      margin-right: 1rem;
    }

    &:nth-child(5n) {
      margin-right: 0;
    }
  }
`
