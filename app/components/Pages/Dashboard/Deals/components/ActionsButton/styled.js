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
  }
`

export const MenuButton = styled.div`
  display: flex;
  align-items: center;
  border-left: 1px solid #000;
  padding: 0 0.625rem;
  background-color: #f2f2f2;
  border-radius: 0 3px 3px 0;

  :hover {
    svg {
      transition: 0.1s ease-in transform;
      fill: ${primary};
    }
  }
`

export const Container = styled.div`
  display: flex;
  height: 2.3rem;
  border-radius: 3px;
  border: 1px solid #000;
  cursor: pointer;

  :hover {
    border-color: ${primary};
  }

  :hover ${MenuButton} {
    border-left-color: ${primary};
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
  padding: 0 1rem;
  z-index: 1;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.15),
    0 8px 10px 0 rgba(0, 0, 0, 0.16);
`

export const MenuItem = styled.div`
  font-weight: 500;
  margin: 1rem 0;
  color: ${props => (props.disabled ? 'gray' : '#000')};

  ${props =>
    props.disabled === false &&
    `
    :hover {
      cursor: pointer;
      color: ${primary};
    }
  `}
`
