import styled from 'styled-components'
import PropTypes from 'prop-types'

/**
 * Computes a shadow for a card effect..
 * @param {Number} position - shadow position - Members: top, bottom
 * @param {Number} depth - depth level
 * @returns {String} shadow.
 */
const getShadow = depth => {
  if (depth < 1 || depth > 5) {
    return 'none'
  }

  const offsetLevels = {
    top: [1.5, 3, 10, 14, 19],
    bottom: [1.5, 3, 6, 10, 15]
  }

  const opacityLevels = {
    top: [0.12, 0.16, 0.19, 0.25, 0.3],
    bottom: [0.24, 0.23, 0.23, 0.22, 0.22]
  }

  const generateShadow = position => {
    const offset = offsetLevels[position][depth - 1]
    const blur = offset * 4
    const colorOpacity = opacityLevels[position][depth - 1]

    return `0 ${offset}px ${blur}px rgba(0, 0, 0, ${colorOpacity})`
  }

  const topShadow = generateShadow('top')
  const bottomShadow = generateShadow('bottom')

  return `${topShadow}, ${bottomShadow}`
}

const Card = styled.div`
  background: #fff;
  border-radius: 3px;
  box-shadow: ${props => getShadow(props.depth)};
`

Card.defaultProps = { depth: 1 }
Card.propTypes = { depth: PropTypes.number }

export default Card
