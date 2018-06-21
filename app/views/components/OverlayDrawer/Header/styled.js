import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 56px;
  background-color: #fff;
  font-size: 17px;
  font-weight: 600;
  color: #263445;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 3px;
`

export const Title = styled.div`
  width: 90%;
`

export const IconContainer = styled.div`
  width: 10%;
  text-align: right;
  cursor: pointer;

  :hover {
    svg > path.svg-icon--close {
      fill: #262626;
    }
  }
`
