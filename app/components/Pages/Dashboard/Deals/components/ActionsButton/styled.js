import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export const PrimaryAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 500;
  height: 100%;
  width: 10rem;

  :hover {
    color: ${primary};
    background-color: #d9d9d9;
  }

  :active {
    background-color: #bfbfbf;
  }
`

export const MenuButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #ccc;
  background-color: #f2f2f2;
  border-radius: 0 3px 3px 0;
  width: 2.3rem;

  :hover,
  :focus {
    background-color: #d9d9d9;

    svg {
      transition: 0.1s ease-in transform;
      fill: ${primary};
    }
  }

  :active {
    background-color: #bfbfbf;
  }
`

export const Container = styled.div`
  display: flex;
  height: 2.3rem;
  opacity: 0.3;
  border-radius: 3px;
  background-color: #e6e6e6;
  border: 1px solid #e6e6e6;
  cursor: pointer;

  :hover {
    border-color: ${primary};
  }
`

export const MenuContainer = styled.div`
  left: 0;
  right: 0;
  position: absolute;
  margin-top: 0.5rem;
  background-color: #fff;
  overflow: auto;
  border-radius: 3px;
  z-index: 1;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.15),
    0 8px 10px 0 rgba(0, 0, 0, 0.16);
`

export const MenuItem = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: ${props => (props.disabled ? 'gray' : '#000')};
  padding: 0.5rem 1rem;

  ${props =>
    props.disabled === false &&
    `
    :hover {
      cursor: pointer;
      background-color: ${primary};
      color: #fff;
    }
  `}
`
