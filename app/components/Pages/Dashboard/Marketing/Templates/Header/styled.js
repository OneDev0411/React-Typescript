import styled from 'styled-components'

import { merriweatherFamilyStyle } from 'components/Typography/styles'

const baseBackgroundImgUrl = '/static/images/marketing/templates/headers'

export const Container = styled.div`
  position: relative;
  height: 18.75rem;
  padding-top: 6.625rem;
  padding-left: 5.5rem;
  margin-bottom: 2rem;
  background-color: ${props => props.brandColor};
  background-repeat: no-repeat;
  background-image: ${({ name }) =>
    `url('${baseBackgroundImgUrl}/${name}/${name}.png')`};
  background-size: ${({ size: { width, height } }) =>
    `${width / 16}rem ${height / 16}rem`};
  background-position: ${props => props.position || 'calc(100% - 2rem) bottom'};

  .c-menu-trigger {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
  }
`

export const Title = styled.h1`
  ${merriweatherFamilyStyle};
  max-width: 28rem;
  margin-bottom: 1rem;
  font-size: 2.5rem;
  line-height: 1.2;
`
