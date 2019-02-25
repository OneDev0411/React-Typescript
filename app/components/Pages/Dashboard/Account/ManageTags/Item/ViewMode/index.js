import React from 'react'

import Tooltip from 'components/tooltip'
import IconButton from 'components/Button/IconButton'
import DeleteIcon from 'components/SvgIcons/Delete/IconDelete'

import { Container, Title } from './styled'
import { LoadingIcon } from '../styled'

export class ViewMode extends React.Component {
  onDeleteClick = event => {
    if (event && event.stopPropagation) {
      event.stopPropagation()
    }

    this.props.onDelete(this.props.tag)
  }

  render() {
    const { tag, loading } = this.props

    return (
      <Container highlight={tag.highlight}>
        <Title>{tag.text}</Title>
        {loading ? (
          <div>
            <LoadingIcon />
          </div>
        ) : (
          <Tooltip caption="Delete tag">
            <IconButton
              isFit
              inverse
              appearance="icon"
              onClick={this.onDeleteClick}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Container>
    )
  }
}
