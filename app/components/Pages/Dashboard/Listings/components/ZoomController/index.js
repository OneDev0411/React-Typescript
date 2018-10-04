import React from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'

import { updateMapZoom } from '../../../../../../store_actions/listings/map'

import IconAdd from '../../../../../../views/components/SvgIcons/Add/AddIcon'
import IconMines from '../../../../../../views/components/SvgIcons/Mines/IconMines'

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
          iconSize="large"
          onClick={this.handleZoomIn}
          disabled={this.props.isFetching}
        >
          <IconAdd />
        </Button>
        <Button
          isFit
          inverse
          iconSize="large"
          onClick={this.handleZoomOut}
          disabled={this.props.isFetching}
        >
          <IconMines />
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
