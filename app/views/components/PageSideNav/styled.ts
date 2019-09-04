import { CSSProperties } from 'react'
import styled from 'styled-components'
import { fade } from '@material-ui/core/styles'

export const BadgeContainer = styled.div`
  color: #1d1f26;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.12));
  padding: 0.13rem ${props => props.theme.spacing(1.5)}px;
  border-radius: 1rem;

  & > span {
    display: block;
  }
`

interface SideNavContainerProps {
  isOpen?: boolean
  width?: CSSProperties['width']
}

export const SideNavContainer = styled.div<SideNavContainerProps>`
  width: ${props => (props.isOpen ? props.width : '0')};
  background-color: ${props => props.theme.palette.grey[100]};
  padding-left: ${props => props.theme.spacing(1)}px;
  padding-top: ${props => props.theme.spacing(2)}px;
  padding-bottom: ${props => props.theme.spacing(2)}px;
  overflow-y: auto;

  h6 {
    padding-left: ${props => props.theme.spacing(2)}px;
    margin-bottom: ${props => props.theme.spacing(2)}px;
    font-weight: 500;
  }

  section {
    margin-bottom: ${props => props.theme.spacing(5)}px;
  }

  .section-item {
    border-radius: 1.25rem 0 0 1.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: unset;
    height: ${props => props.theme.spacing(5)}px;
    text-decoration: none;
    transition: all 0.5s;

    &:focus {
      outline: none;
    }
    &:hover .section-item__delete {
      opacity: 1;
    }
  }

  .section-item__delete {
    padding: 0.5rem 0.75rem;
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    opacity: 0;
    transition: all 0.5s;
    background: ${props => fade(props.theme.palette.text.primary, 0.1)};

    & svg {
      fill: ${props => props.theme.palette.text.primary};
    }

    &:hover {
      background: ${props => fade(props.theme.palette.text.primary, 0.2)};
    }
  }

  .section-item.is-selected {
    background: ${props => fade(props.theme.palette.primary.main, 0.12)};
    color: ${props => props.theme.palette.primary.main};

    & > span {
      font-weight: 500;
    }

    &:hover {
      background: ${props => fade(props.theme.palette.primary.main, 0.12)};
    }

    .section-item__icon > svg {
      fill: ${props => props.theme.palette.primary.main};
    }

    .section-item__delete {
      background: ${props => fade(props.theme.palette.primary.main, 0.1)};

      & svg {
        fill: ${props => props.theme.palette.primary.main};
      }

      &:hover {
        background: ${props => fade(props.theme.palette.primary.main, 0.2)};
      }
    }
  }

  .section-item.is-disabled {
    background: transparent;
    color: ${props => props.theme.palette.text.disabled};
    cursor: default;

    .section-item__icon > svg {
      fill: ${props => props.theme.palette.text.disabled};
    }
  }
`
