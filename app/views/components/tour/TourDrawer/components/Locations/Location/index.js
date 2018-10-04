import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import Avatar from '../../../../../Avatar'
import Button from '../../../../../Button/IconButton'
import IconPinOn from '../../../../../SvgIcons/MapPinOn/IconMapPinOn'

import { Container, Listing, Title, Details, CloseIcon } from './styled'

const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

export class Location extends React.Component {
  static propTypes = {
    location: PropTypes.shape().isRequired,
    handleRemove: PropTypes.func.isRequired
  }

  onRemove = () => this.props.handleRemove(this.props.location)

  render() {
    const listing = this.props.location[this.props.location.association_type]

    return (
      <Container>
        <Flex alignCenter justifyBetween style={{ padding: '0 0.5em' }}>
          <Flex alignCenter>
            <IconPinOn style={{ fill: '#fe2b27' }} />
            <div style={{ fontSize: '1.5em', fontWeight: 500 }}>{`${
              ALPHABET[this.props.index]
            }`}</div>
          </Flex>
          <Button isFit type="button" onClick={this.onRemove}>
            <CloseIcon />
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
    )
  }
}
