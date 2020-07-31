import React from 'react'
import { IconButton } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'

import Tooltip from 'components/tooltip'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
      <Container highlight={tag.highlight} data-test={`tag-item-${tag.text}`}>
        <Title>{tag.text}</Title>
        {loading ? (
          <div>
            <LoadingIcon />
          </div>
        ) : (
          <Tooltip caption="Delete tag">
            <IconButton size="small" onClick={this.onDeleteClick}>
              <SvgIcon path={mdiTrashCanOutline} />
            </IconButton>
          </Tooltip>
        )}
      </Container>
    )
  }
}
