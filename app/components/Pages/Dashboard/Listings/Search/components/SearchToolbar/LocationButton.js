import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import cn from 'classnames'

import IconLocation from '../../../../../../../views/components/SvgIcons/Location/IconLocation.js'
import { getLocation } from '../../../../../../../store_actions/listings/map/user-location'
import { getUserLocationIsFetching } from '../../../../../../../reducers/listings/map/user-location'
import ToolTip from '../../../../../../../views/components/tooltip'

const Icon = IconLocation.extend`
  fill: #000;
`
const DrawingButton = ({ isFetching, getLocation }) => (
  <ToolTip caption="Get your exact location on the map" placement="bottom">
    <button
      onClick={() => !isFetching && getLocation()}
      className={cn('c-mls-toolbar__btn c-mls-toolbar__btn--location', {
        'c-mls-toolbar__btn--disabled': isFetching
      })}
    >
      <Icon isFetching={isFetching} />
    </button>
  </ToolTip>
)

export default compose(
  connect(
    ({ search }) => {
      const isFetching =
        getUserLocationIsFetching(search.map.userLocation) ||
        search.listings.isFetching

      return { isFetching }
    },
    { getLocation }
  )
)(DrawingButton)
