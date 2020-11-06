import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import { Draggable } from 'react-beautiful-dnd'
import { Card } from '@material-ui/core'

import { mdiMapMarkerOutline, mdiClose } from '@mdi/js'

import useRaisedMuiCard from 'hooks/use-raised-mui-card'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { getIndexLabel } from 'utils/helpers'
import { red } from 'views/utils/colors'
import { Avatar } from 'components/Avatar'
import Button from 'components/Button/IconButton'

import { Container, Listing, Title, Details, CloseIcon } from './styled'

Location.propTypes = {
  handleRemove: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  location: PropTypes.shape().isRequired
}

export function Location({ handleRemove, index, location }) {
  const listing = location[location.association_type]
  const { isRaised, raise, stopRaise } = useRaisedMuiCard()

  return (
    <Draggable key={listing.id} draggableId={listing.id} index={index}>
      {(draggableProvided, draggableSnapshot) => (
        <div
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          style={{
            ...draggableProvided.draggableProps.style,
            marginBottom: '1em'
          }}
        >
          <Card
            onMouseOver={raise}
            onFocus={raise}
            onMouseOut={stopRaise}
            onBlur={stopRaise}
            raised={isRaised || draggableSnapshot.isDragging}
            {...draggableProvided.dragHandleProps}
          >
            <Container>
              <Flex alignCenter justifyBetween style={{ padding: '0 0.5em' }}>
                <Flex alignCenter>
                  <SvgIcon path={mdiMapMarkerOutline} color={red.primary} />
                  <div
                    style={{ fontSize: '1.5em', fontWeight: 500 }}
                  >{`${getIndexLabel(index)}`}</div>
                </Flex>
                <Button
                  isFit
                  type="button"
                  onClick={() => handleRemove(location)}
                >
                  <CloseIcon path={mdiClose} />
                </Button>
              </Flex>
              <Listing>
                <Avatar {...listing.avatar} />
                <div style={{ marginLeft: '0.5em' }}>
                  <Link to={listing.url}>
                    <Title>{listing.title}</Title>
                  </Link>
                  <Details>{listing.details}</Details>
                </div>
              </Listing>
            </Container>
          </Card>
        </div>
      )}
    </Draggable>
  )
}
