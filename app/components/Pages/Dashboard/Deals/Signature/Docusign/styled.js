import styled from 'styled-components'

import { Button as MuiButton } from '@material-ui/core'

export const Button = styled(MuiButton)`
  margin-left: 10px;
  color: #2196f3;
  background-color: #fff;
  justify-content: center;
  border: none;
  border-radius: 3px;
  width: 100px;
`

export const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  background-color: #2196f3;
  font-size: 17px;
  font-weight: 500;
  color: #fff;
  text-align: center;

  img {
    margin-top: 5px;
    height: 45px;
    margin-left: 16px;
  }
`
