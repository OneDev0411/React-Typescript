import styled from 'styled-components'

import { grey } from 'views/utils/colors'

const getMQWidth = (base, props) =>
  props.isSideMenuOpen ? base + 10.2578125 : base

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-height: 22rem;
  margin-bottom: 1.5rem;
  border-radius: 3px;
  justify-content: center;
  background-color: ${grey.A100};
  border: 1px solid transparent;

  &:hover {
    border-color: ${grey.A300};

    .action-bar {
      visibility: visible;
    }
  }

  @media screen and (min-width: ${props => getMQWidth(40, props)}em) {
    width: calc(50% - 0.75rem);
    margin-right: 1.5rem;

    &:nth-of-type(2n) {
      margin-right: 0;
    }
  }

  @media screen and (min-width: ${props => getMQWidth(64, props)}em) {
    width: calc(100% / 3 - 1rem);

    &:nth-of-type(2n) {
      margin-right: 1.5rem;
    }
    &:nth-of-type(3n) {
      margin-right: 0;
    }
  }

  @media screen and (min-width: ${props => getMQWidth(90, props)}em) {
    width: calc(100% / 4 - 1.125rem);

    &:nth-of-type(3n) {
      margin-right: 1.5rem;
    }
    &:nth-of-type(4n) {
      margin-right: 0;
    }
  }

  @media screen and (min-width: ${props => getMQWidth(120, props)}em) {
    width: calc(100% / 5 - 1.2rem);

    &:nth-of-type(4n) {
      margin-right: 1.5rem;
    }
    &:nth-of-type(5n) {
      margin-right: 0;
    }
  }

  > img,
  > video {
    max-width: 100%;
  }

  .action-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    visibility: hidden;
    padding: 1rem;
    background-color: #fff;
  }
`
