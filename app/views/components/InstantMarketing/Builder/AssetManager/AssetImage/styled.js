import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export const Image = styled.img`
  margin: 8px 3% 8px 5%;
  border-radius: 2px;
  width: 90%;
  cursor: pointer;
`

export const CropButton = styled.div`
  position: absolute;
  display: none;
  left: 10%;
  bottom: 10%;
  color: #000;
  background: rgba(255, 255, 255, 0.5);
  padding: 2px 6px;
  cursor: pointer;
  border-radius: 3px;

  :hover {
    color: #fff;
    background: ${primary};
  }
`

export const Container = styled.div`
  position: relative;

  :hover ${CropButton} {
    display: block;
  }
`
