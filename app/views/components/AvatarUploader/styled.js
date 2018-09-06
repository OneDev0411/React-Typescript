import styled from 'styled-components'

import { setVisuallyHidden } from '../../utils/visually-hidden'

export const Container = styled.div`
  position: relative;
  width: ${props => props.size || 104}px;
  height: ${props => props.size || 104}px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: #d4d4d4;
`

export const Status = styled.div`
  position: absolute;
  top: -4px;
  right: 0px;
  width: 32px;
  height: 32px;
  z-index: 1;
  border: solid 8px #fff;
  border-radius: 100%;
  background-color: ${props => (props.isOnline ? '#35b863' : '#D4D4D4')};
`

export const Image = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 100%;
`

export const Initials = styled.div`
  font-size: 3.6rem;
  color: #fff;
`

export const TriggerText = styled.div`
  color: #2196f3;
  visibility: hidden;
  font-weight: normal;
  transition: visibility 0.1s 0.1s ease-in;
`

export const Trigger = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 100%;
  transition: background 0.2s ease-in;

  &:hover {
    background: rgb(54, 71, 85, 0.9);

    > ${TriggerText} {
      visibility: visible;
    }
  }
`
export const Input = setVisuallyHidden('input')

export const Loading = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #2196f3;
  border-radius: 100%;
  background: rgb(54, 71, 85, 0.9);
`
