import styled, { ThemeProps } from 'styled-components'
import { Theme } from '@material-ui/core'

export const TemplateDate = styled.div`
  margin-top: 0.5rem;
  position: absolute;
  bottom: -3rem;
  opacity: 0;
  transform: translateY(0.5rem);
  transition: all 0.35s;

  .caption {
    letter-spacing: 1.5px;
    font-size: 0.75rem;
    color: ${({ theme }: ThemeProps<Theme>) => theme.palette.grey.A700};
  }
`

export const MarketingTemplateCardContainer = styled.div<{
  isInstance: boolean
}>`
  position: relative;
  margin-bottom: ${({ isInstance }) => (isInstance ? '5rem' : '2rem')};
`
export const MarketingTemplateCardRoot = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 3px;
  transition: 0.3s;
  min-height: 15.8rem;
  background: ${({ theme }: ThemeProps<Theme>) => theme.palette.grey['200']};
  overflow: hidden;
  box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2), 0px 3px 4px rgba(0, 0, 0, 0.12),
    0px 2px 0px rgba(0, 0, 0, 0.14);

  &:not(.is-video) {
    cursor: zoom-in;
  }

  &:after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    opacity: 0;
    z-index: 1;
    transition: all 0.5s;
    content: '';
  }

  & img {
    width: 100%;
  }

  & .action-bar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0.5rem;
    z-index: 2;
    opacity: 0;
    transform: translateY(0.5rem);
    transition: all 0.35s;

    .action-bar__right {
      display: flex;
      justify-content: flex-end;
    }

    .action-bar__icon-button {
      padding: 0 0.5rem;
      background: rgba(0, 0, 0, 0.55);

      & svg {
        fill: #fff;
      }

      &:hover {
        background: #000;
      }
    }

    button {
      margin-right: 0.5rem;
    }

    button:last-child {
      margin-right: 0;
    }
  }

  &:not(.loading):hover {
    .action-bar {
      opacity: 1;
      transform: translateY(0);
    }

    &:after {
      opacity: 1;
    }
  }

  &.loading {
    &:after {
      background: rgba(255, 255, 255, 0.7);
      opacity: 1;
    }
  }

  &.loading {
    cursor: wait;
  }

  &:hover + ${TemplateDate} {
    opacity: 1;
    transform: translateY(0);
  }

  &.loading + ${TemplateDate} {
    opacity: 1;
    transform: translateY(0);
  }
`
