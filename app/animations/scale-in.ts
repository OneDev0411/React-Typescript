import { keyframes } from 'styled-components'

export const scaleInAnimation = keyframes`
  from {
    transform: scale(0.5);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`
