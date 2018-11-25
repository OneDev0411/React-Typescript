import styled from 'styled-components'
import { primary } from 'views/utils/colors'

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 3rem;
  border-radius: 3px;
  background-color: ${primary};
  position: fixed;
  right: 3rem;
  bottom: 1rem;
`

export const MenuItem = styled.div`
  margin: 0.5rem 0;
  cursor: pointer;

  i {
    color: #fff;
    font-size: 1.5rem;
    :hover {
      color: #d4d4d4;
    }
  }
`
