import styled from 'styled-components'

import 'draft-js/dist/Draft.css'
import 'draft-js-emoji-plugin/lib/plugin.css'

export const Toolbar = styled.div`
  margin: 1rem 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
`

export const RechatButton = styled.a`
  position: relative;
  display: inline-flex;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  margin-right: 0.5rem;
  cursor: pointer;

  & svg {
    display: inline-block;
  }

  &:hover svg * {
    fill: #999;
  }

  ${({ isActive }) =>
    isActive &&
    `
    svg * {
      fill: blue;
    }
  `}

  .PopOver {
    position: absolute;
    top: 24px;
    left: 0;
    background: #fff;
    padding: 8px;
    display: block;
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
    z-index: 2019;
    opacity: 0;
    transition: all 0.5s;
    pointer-events: none;
    transform: translateY(-8px);
  }

  .PopOver.opened {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }
`

export const RechatTextButton = styled.a`
  display: block;
  cursor: pointer;
  padding: 8px;
  color: ${({ isActive }) => (isActive ? 'blue' : '#333')};

  &:hover {
    color: #999;
  }
`

export const Separator = styled.span`
  height: 16px;
  width: 2px;
  background: #ccc;
  margin-right: 0.5rem;
`
