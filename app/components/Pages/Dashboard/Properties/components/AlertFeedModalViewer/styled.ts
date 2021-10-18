import styled from 'styled-components'

export const Card = styled.div`
  width: 100%;
  margin-bottom: 1rem;

  @media screen and (min-width: 48em) {
    width: calc((100% / 2) - 0.5rem);
    margin-right: 1rem;

    &:nth-child(2n) {
      margin-right: 0;
    }
  }

  @media screen and (min-width: 72em) {
    width: calc((100% / 3) - (2rem / 3));

    &:nth-child(2n) {
      margin-right: 1em;
    }

    &:nth-child(3n) {
      margin-right: 0;
    }
  }

  @media screen and (min-width: 90em) {
    width: calc((100% / 4) - 0.75rem);

    &:nth-child(3n) {
      margin-right: 1rem;
    }

    &:nth-child(4n) {
      margin-right: 0;
    }
  }

  @media screen and (min-width: 110em) {
    width: calc((100% / 5) - 0.8rem);

    &:nth-child(4n) {
      margin-right: 1rem;
    }

    &:nth-child(5n) {
      margin-right: 0;
    }
  }
`
