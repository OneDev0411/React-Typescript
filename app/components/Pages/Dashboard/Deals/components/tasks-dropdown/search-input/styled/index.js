import styled from 'styled-components'

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-radius: 3px;
  border: 1px solid #eee;
  padding: 7px 5px;

  &:hover {
    background-color: #fff;
  }
`

export const Input = styled.input`
  width: 95%;
  border: none;
  cursor: pointer;
  background-color: transparent;

  :focus {
    outline: none;
  }
`

export const Title = styled.div`
  width: 95%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${props => (props.hasTask ? '#000' : 'gray')};
`

export const Indicator = styled.i`
  width: 5%;
  color: #eee;
`
