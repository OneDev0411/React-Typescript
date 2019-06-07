import styled from 'styled-components'

import { primary } from 'views/utils/colors'

const BG_IMAGE_URL = '/static/images/noMatch/'

export const Container = styled.div`
  color: #fff;
  height: 100vh;
  background: ${primary} url('${BG_IMAGE_URL}404.png') no-repeat center center fixed;
  background-size: cover;

  @media (max-width: 30em) and (orientation: portrait) {
    background-image: url('${BG_IMAGE_URL}404-phone-background.png');
  }

  @media (min-width: 30em) and (max-width: 75em) and (orientation: portrait) {
    background-image: url('${BG_IMAGE_URL}404-tablet-background.png');
  }

  .wrapper {
    padding: 1.5em;
    max-width: 75em;
  }

  .logo {
    margin: 0 0 1.5rem;
    font-weight: 900;
    font-size: 1.5rem;

    @media (min-width: 43em) {
      font-size: 2rem;
    }
  }
  
  .content {
    margin: 0 auto;
    padding-top: 12%;
    text-align: center;

    h2 {
      font-weight: 300;
      font-size: 1rem;
      margin-bottom: 1em;

      @media (min-width: 43em) {
        font-size: 1.5rem;
      }
    }
    a {
      color: inherit;
      text-decoration: underline;
      text-decoration-color: rgba(255, 255, 255, 0.5);
    }

    @media (max-height: 43em) {
      padding-top: 0;
    }
  }
`
