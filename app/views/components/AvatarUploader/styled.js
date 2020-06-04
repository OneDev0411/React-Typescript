import styled from 'styled-components'

import { setVisuallyHidden } from '../../utils/visually-hidden'
import { borderColor, brandBackground } from '../../utils/colors'

export const Container = styled.div`
  position: relative;
  width: ${props => props.size || 88}px;
  height: ${props => props.size || 88}px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: ${props => props.theme.palette.divider};
  > button {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
`

export const Status = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 26px;
  height: 26px;
  z-index: 1;
  border: solid 5px ${brandBackground};
  border-radius: 100%;
  background-color: ${props => (props.isOnline ? '#35b863' : borderColor)};
`

export const Image = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 100%;
`

export const Initials = styled.div`
  font-size: 1.5rem;
  color: ${props => props.theme.palette.text.primary};
`

export const TriggerText = styled.div`
  font-size: 0.75rem;
  color: #fff;
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
    background: rgba(54, 71, 85, 0.9);

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
  font-size: 0.75rem;
  color: #fff;
  border-radius: 100%;
  background: rgb(54, 71, 85, 0.9);
`
