import styled from 'styled-components'

import IconButton from 'components/Button/IconButton'

export const getMQWidth = (base, props) =>
  props.isSideMenuOpen ? base + 11 : base

export const Box = styled.div`
  margin-bottom: 2rem;

  @media (min-width: ${props => getMQWidth(43, props)}em) {
    width: calc(50% - 3rem);
    margin: 0 1.5rem 3rem;
  }

  @media (min-width: ${props => getMQWidth(64, props)}em) {
    width: calc(100% / 3 - 3rem);
  }

  @media (min-width: ${props => getMQWidth(80, props)}em) {
    width: calc(25% - 3rem);
  }

  @media (min-width: ${props => getMQWidth(100, props)}em) {
    width: calc(20% - 3rem);
  }
`

export const ImageContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 15.8rem;
  border-radius: 3px;
  box-shadow: 0px 2px 15px -5px rgba(0, 0, 0, 0.5);
  transform: translate3d(0, 0, 0);
  transition: 0.3s;

  &:hover {
    box-shadow: 0 22px 43px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);

    .action-bar {
      visibility: visible;
    }
  }

  > img,
  > video {
    width: 100%;
  }

  .action-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    visibility: hidden;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.95);
  }
`

export const VideoController = styled(IconButton)`
  width: 4rem;
  height: 4rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`
