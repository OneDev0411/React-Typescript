import styled from 'styled-components'

import {
  primary,
  brandBackground,
  borderColor
} from '../../../../../views/utils/colors'

export const PageWrapper = styled.div`
  background-color: ${brandBackground};
`

export const PageContainer = styled.div`
  max-width: 1456px;
  margin: 0 auto;

  /* 1681px */
  @media (min-width: 105.0625em) {
    max-width: 1616px;
  }
`

export const Card = styled.div`
  margin-bottom: 1em;
  background: #fff;
  border-radius: 3px;
  border: 1px solid ${borderColor};
`

export const ColumnsContainer = styled.div`
  padding: 0 2.5em;

  /* 768px */
  @media (min-width: 48em) {
    display: flex;
  }
`

export const SideColumnWrapper = styled.div`
  /* overflow: hidden; */

  @media (min-width: 48em) {
    width: 30%;
    display: flex;
    flex-direction: column;
  }

  /* 1681px */
  @media (min-width: 105.0625em) {
    width: 25%;
    display: block;
  }
`

export const SecondColumn = styled.div`
  @media (min-width: 48em) {
    width: calc(70% - 1em);
    margin-left: 1em;
  }

  @media (min-width: 105.0625em) {
    margin: 0 1em;
    width: calc(50% - 2em);
  }
`

export const ThirdColumn = styled.div`
  @media (min-width: 105.0625em) {
    width: 25%;
  }
`

export const TabsContainer = styled.div`
  margin-bottom: 2em;
  border-radius: 3px;
  background: #fff;
  border: 1px solid ${borderColor};

  &:hover {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  }

  [data-reach-tab-list] {
    display: flex;
    border-radius: 3px;
    background-color: #fff;
    border-bottom: solid 1px ${borderColor};
  }

  [data-reach-tab] {
    width: 50%;
    border: none;
    text-align: center;
    background: transparent;

    > span {
      position: relative;
      height: 4rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-size: 1.25rem;
      line-height: 1;

      &:after {
        content: '';
        width: 100%;
        height: 0.25rem;
        position: absolute;
        left: 0;
        bottom: -1px;
        opacity: 0;
        will-change: opacity;
        transition: all 0.15s ease-out;
        background-color: ${primary};
      }

      &:hover {
        &:after {
          opacity: 1;
          z-index: 1;
        }
      }
    }

    &[aria-selected='true'] > span {
      font-weight: 600;
      pointer-events: none;
      color: ${primary};

      &:after {
        opacity: 1;
        z-index: 1;
      }
    }
  }
`
