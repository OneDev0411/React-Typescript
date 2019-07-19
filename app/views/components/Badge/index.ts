import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

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

const Badge = styled.span<{
  appearance: keyof typeof badgeAppearances
  large?: boolean
}>`
  padding: 0.04rem 0.3rem;
  text-align: center;
  line-height: 1.33;

  ${props =>
    props.large
      ? css`
          font-size: 0.9rem;
          min-width: 1.75rem;
        `
      : css`
          font-size: 0.75rem;
          min-width: 1.5rem;
        `}

  ${props => badgeAppearances[props.appearance]};
`

export default Object.assign(Badge, {
  propTypes,
  defaultProps
})
