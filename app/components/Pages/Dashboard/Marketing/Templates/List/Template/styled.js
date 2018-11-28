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
  border: 1px solid ${grey.A200};

  &:hover {
    border-color: ${grey.A300};

    .action-bar {
      visibility: visible;
    }
  }

  @media screen and (min-width: ${props => getMQWidth(40, props)}em) {
    width: calc(50% - 1.5rem);
    margin-left: 0.75rem;
    margin-right: 0.75rem;
  }

  @media screen and (min-width: ${props => getMQWidth(64, props)}em) {
    width: calc(100% / 3 - 1.5rem);
  }

  @media screen and (min-width: ${props => getMQWidth(90, props)}em) {
    width: calc(100% / 4 - 1.5rem);
  }

  @media screen and (min-width: ${props => getMQWidth(120, props)}em) {
    width: calc(100% / 5 - 1.5rem);
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
    background-color: rgba(255, 255, 255, 0.7);
  }
`
