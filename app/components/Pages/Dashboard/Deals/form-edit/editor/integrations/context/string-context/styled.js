import styled from 'styled-components'

export const Container = styled.div`
  position: absolute;
  top: ${props => props.position.top + 20}px;
  left: ${props => props.position.left}px;
  width: 290px;
  min-height: 80px;
  background-color: #fff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.4);
  border-radius: 5px;
  padding: 10px;
`

export const InputContainer = styled.div`
  width: 100%;
`

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-top: 20px;

  button {
    margin-left: 5px;
  }
`
