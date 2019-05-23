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
  padding: 0.04rem 0.3rem;
  font-size: 12px;
  min-width: 24px;
  text-align: center;
  line-height: 1.33;

  ${props => badgeAppearances[props.appearance]};
`

export default Object.assign(Badge, {
  propTypes,
  defaultProps
})
