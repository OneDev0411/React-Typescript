import React from 'react'

import { mdiMinus, mdiPlus } from '@mdi/js'
import { connect } from 'react-redux'
import _ from 'underscore'

import { updateMapZoom } from '@app/store_actions/listings/map'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { Container, Button } from './styled'

class ZoomController extends React.Component {
  handleZoomIn = () =>
    _.debounce(
      this.props.dispatch(updateMapZoom(this.props.tabName, 'IN')),
      300
    )

  handleZoomOut = () =>
    _.debounce(
      this.props.dispatch(updateMapZoom(this.props.tabName, 'OUT')),
      300
    )

  render() {
    return (
      <Container isTopOfLocation={this.props.isTopOfLocation}>
        <Button
          isFit
          inverse
          onClick={this.handleZoomIn}
          disabled={this.props.isFetching}
        >
          <SvgIcon path={mdiPlus} />
        </Button>
        <Button
          isFit
          inverse
          onClick={this.handleZoomOut}
          disabled={this.props.isFetching}
        >
          <SvgIcon path={mdiMinus} />
        </Button>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.search.listings.isFetching
  }
}

export default connect(mapStateToProps)(ZoomController)
