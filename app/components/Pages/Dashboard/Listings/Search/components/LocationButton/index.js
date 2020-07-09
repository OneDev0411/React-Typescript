import React from 'react'
import { connect } from 'react-redux'

import { mdiCrosshairsGps } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getLocation } from '../../../../../../../store_actions/listings/map/user-location'
import { getUserLocationIsFetching } from '../../../../../../../reducers/listings/map/user-location'
import Tooltip from '../../../../../../../views/components/tooltip'

import { Button } from './styled'

class LocationButton extends React.Component {
  onClick = () => {
    if (!this.props.isFetching) {
      this.props.dispatch(getLocation())
    }
  }

  render() {
    return (
      <Tooltip caption="Get your exact location on the map">
        <Button
          isFit
          inverse
          iconSize="large"
          onClick={this.onClick}
          disabled={this.props.isFetching}
        >
          <SvgIcon path={mdiCrosshairsGps} />
        </Button>
      </Tooltip>
    )
  }
}

function mapStateToProps(state) {
  const isFetching =
    getUserLocationIsFetching(state.search.map.userLocation) ||
    state.search.listings.isFetching

  return { isFetching }
}

export default connect(mapStateToProps)(LocationButton)
