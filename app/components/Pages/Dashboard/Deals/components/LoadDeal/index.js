import PropTypes from 'prop-types'

import { useLoadDeal } from 'hooks/use-load-deal'

LoadDeal.propTypes = {
  id: PropTypes.string.isRequired,
  deal: PropTypes.object
}

LoadDeal.defaultProps = {
  deal: null
}

function LoadDeal(props) {
  const hookData = useLoadDeal(props.id, props.deal)

  return props.children({ ...hookData })
}

export default LoadDeal
