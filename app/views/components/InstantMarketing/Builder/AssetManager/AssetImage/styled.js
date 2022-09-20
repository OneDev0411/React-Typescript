import styled from 'styled-components'

import { primary, primaryDark } from 'views/utils/colors'

export const Image = styled.img`
  margin: 8px 3% 8px 5%;
  border-radius: 2px;
  width: 90%;
  cursor: pointer;
  -moz-user-select: -moz-none;
  -moz-user-drag: -moz-none;
  -khtml-user-select: none;
  -khtml-user-drag: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  -ms-user-select: none;
  -ms-user-drag: none;
  user-select: none;
  user-drag: none;
`

export const CropButton = styled.div`
  position: absolute;
  display: none;
  left: 10%;
  bottom: 10%;
  padding: 2px 6px;
  cursor: pointer;
  border-radius: 3px;
  color: #fff;
  background: ${primary};

  :hover {
    background: ${primaryDark};
  }
`

export const Container = styled.div`
  position: relative;

  :hover ${CropButton} {
    display: block;
  }
`
