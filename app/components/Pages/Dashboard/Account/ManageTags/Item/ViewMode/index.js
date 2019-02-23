import React from 'react'

import Tooltip from 'components/tooltip'
import IconButton from 'components/Button/IconButton'
import DeleteIcon from 'components/SvgIcons/Delete/IconDelete'

import { Container, Title } from './styled'

export class ViewMode extends React.Component {
  onClick = event => {
    if (event && event.stopPropagation) {
      event.stopPropagation()
    }

    this.props.onDelete(this.props.tag)
  }

  render() {
    return (
      <Container highlight={this.props.tag.highlight}>
        <Title>{this.props.tag.text}</Title>
        <Tooltip caption="Delete tag">
          <IconButton isFit inverse appearance="icon" onClick={this.onClick}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Container>
    )
  }
}
