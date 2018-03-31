import styled from 'styled-components'
import ShadowButton from '../../../../../components/Button/ShadowButton'
import CloseIcon from '../../../../../components/SvgIcons/Close/CloseIcon'

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 1em;
  margin-bottom: 1em;
  padding: 0.5em 3em 0.5em 0.5em;
  background: #fff;
  border-radius: 3px;
  border: 1px solid #d4dfe6;

  &:hover {
    border-color: ${props => (props.removable ? '#2196f3' : '#d4dfe6')};
  }
`

export const Title = styled.div`
  font-size: 1.6rem;
  color: #1e364b;
`

export const Details = styled.div`
  color: #8da2b5;
  line-height: 1;
`

export const Button = ShadowButton.extend`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  font-size: 0;

  &:focus {
    outline-width: 2px;
  }

  &:hover svg {
    fill: #000;
  }
`

export const RemoveIcon = CloseIcon.extend`
  fill: #7b91a6;
`
