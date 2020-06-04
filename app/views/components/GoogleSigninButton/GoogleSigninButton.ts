import styled from 'styled-components'

const bgBaseUrl = '/static/images/google-signin-btn/bg--'

interface Props {
  size?: 'large'
}

export const GoogleSigninButton = styled.button<Props>`
  padding: 0;
  border: none;
  text-indent: -10000px;
  background-color: transparent;
  background-image: ${props =>
    `url(${bgBaseUrl}${props.disabled ? 'disabled' : 'normal'}@2x.png)`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;

  ${props => {
    if (props.size && props.size === 'large') {
      return `
            width: 240px;
            height: 58px;
            min-height: 58px; 
        `
    }

    return `width: 160px;
    height: 40px;
    min-height: 40px;`
  }};
`
