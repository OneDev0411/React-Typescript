import React from 'react'
import { connect } from 'react-redux'

import { mdiPencil } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import {
  activeDrawing,
  inactiveDrawing
} from '../../../../../../../store_actions/listings/map/drawing'

import { Button } from './styled'

class DrawingButton extends React.Component {
  onClick = () => {
    if (this.props.isDrawing) {
      this.props.dispatch(inactiveDrawing())
    } else {
      this.props.dispatch(activeDrawing())
    }
  }

  render() {
    if (!this.props.isLoggedIn) {
      return null
    }

    return (
      <Button
        onClick={this.onClick}
        disabled={this.props.isDrawing || this.props.isFetching}
      >
        <SvgIcon path={mdiPencil} />
        Draw
      </Button>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user,
    isDrawing: state.search.map.drawing.isDrawing,
    isFetching: state.search.listings.isFetching
  }
}

export default connect(mapStateToProps)(DrawingButton)
