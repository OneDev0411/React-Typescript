import React from 'react'

import Tooltip from 'components/tooltip'
import IconButton from 'components/Button/IconButton'
import DeleteIcon from 'components/SvgIcons/Delete/IconDelete'

import { Container, Title } from './styled'

export default function ViewMode({ tag, onDelete }) {
  return (
    <Container>
      <Title>{tag.text}</Title>
      <Tooltip caption="Delete tag">
        <IconButton
          isFit
          inverse
          appearance="icon"
          onClick={event => {
            if (event && event.stopPropagation) {
              event.stopPropagation()
            }

            onDelete(tag)
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Container>
  )
}
