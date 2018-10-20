import { Link } from 'react-router'

import Button from '../ActionButton'

const defaultProps = {
  ...Button.defaultProps,
  appearance: 'link'
}

export default Object.assign(Button.withComponent(Link), {
  defaultProps,
  displayName: 'LinkButton'
})
