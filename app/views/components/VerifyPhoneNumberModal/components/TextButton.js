import ShadowButton from '../../Button/ShadowButton'

export const TextButton = ShadowButton.extend`
  color: #2196f3;

  &:hover {
    text-decoration: underline;
  }
`
