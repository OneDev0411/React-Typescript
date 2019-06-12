import { useEffect } from 'react'

import PropTypes from 'prop-types'

import { useLoadDeal } from 'hooks/use-load-deal'

LoadDeal.propTypes = {
  id: PropTypes.string.isRequired,
  deal: PropTypes.object,
  onLoad: PropTypes.func
}

LoadDeal.defaultProps = {
  deal: null,
  onLoad: () => {}
}

function LoadDeal({ onLoad, ...props }) {
  const { isFetchingCompleted, ...data } = useLoadDeal(props.id, props.deal)

  useEffect(() => {
    if (isFetchingCompleted) {
      onLoad()
    }
  }, [isFetchingCompleted, onLoad])

  return props.children({ ...data, isFetchingCompleted })
}

export default LoadDeal
