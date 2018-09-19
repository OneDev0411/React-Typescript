import PropTypes from 'prop-types'
import styled from 'styled-components'

import { badgeAppearances } from './style'

const propTypes = {
  /**
   * The appearance of the badge.  {red}
   */
  appearance: PropTypes.oneOf(Object.keys(badgeAppearances))
}

const defaultProps = {
  appearance: 'red'
}

const Badge = styled.span`
  padding: 0.2em 0.5em;
  min-width: 28px;
  text-align: center;
  font-size: 14px;
  line-height: 1;

  ${props => badgeAppearances[props.appearance]};
`

export default Object.assign(Badge, {
  propTypes,
  defaultProps
})
