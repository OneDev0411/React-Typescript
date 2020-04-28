import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { useTheme } from '@material-ui/core'

import {
  getField,
  getStatus,
  getSide,
  getAddress,
  getFormattedPrice
} from 'models/Deal/helpers/context'

import Avatar from 'components/Avatar'
import { Container } from 'components/SelectContactModal/components/ContactItem'

import { Details, Status } from './styled'

Item.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isHighlighted: PropTypes.bool.isRequired
}

export function Item(props) {
  const { item, onClickHandler } = props
  const status = getStatus(item)
  const theme = useTheme()

  if (props.itemRenderer) {
    return props.itemRenderer({
      ...props,
      status,
      getAvatarProps,
      getPrice,
      onClickHandler
    })
  }

  return (
    <Container {...props} onClick={() => onClickHandler(item)}>
      <Avatar
        backgroundColor={theme.palette.grey['400']}
        {...getAvatarProps(item)}
      />
      <div style={{ paddingLeft: '1em' }}>
        <Flex alignCenter>
          <Details>{getPrice(item) || '$0'}</Details>
          <Status status={status}>{status || 'Draft'}</Status>
        </Flex>
        <Flex alignCenter style={{ color: '#7f7f7f' }}>
          <Details style={{ marginRight: '0.5em' }}>{getSide(item)}</Details>
          <span>{getAddress(item)}</span>
        </Flex>
      </div>
    </Container>
  )
}

function getAvatarProps(deal) {
  return {
    size: 40,
    image: getField(deal, 'photo'),
    placeHolderImage: '/static/icons/associated-deals-place-holder.svg'
  }
}

function getPrice(deal) {
  const price =
    getField(deal, 'sales_price') ||
    getField(deal, 'list_price') ||
    getField(deal, 'lease_price')

  return getFormattedPrice(price)
}
