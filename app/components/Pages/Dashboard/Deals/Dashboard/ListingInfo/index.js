import React from 'react'
import Flex from 'styled-flex-component'

import { H1 } from 'components/Typography/headings'
import IconLink from 'components/SvgIcons/LinkOpen/IconLink'

import Deal from 'models/Deal'

import { ListingImage } from './Image'
import MlsConnect from './MlsConnect'

import { Divider } from '../styled'
import { MLSLink } from './styled'

function getTitle(deal) {
  return Deal.get.field(deal, 'street_address') || deal.title
}

function getAddress(deal) {
  const city = Deal.get.field(deal, 'city') || ''
  const state = Deal.get.field(deal, 'state') || ''
  const zipcode = Deal.get.field(deal, 'postal_code') || ''

  if ([city, state, zipcode].join('').length === 0) {
    return ''
  }

  return `${city}, ${state} ${zipcode}`
}

export function ListingInfo(props) {
  const address = getAddress(props.deal)

  return (
    <Flex alignCenter>
      <ListingImage deal={props.deal} />

      <Flex column style={{ padding: '0.5em 1.5em' }}>
        <Flex alignCenter>
          <H1 style={{ lineHeight: 1.5 }}>{getTitle(props.deal)}</H1>

          {props.deal.listing && (
            <MLSLink to={`/dashboard/mls/${props.deal.listing}`}>
              <IconLink />
            </MLSLink>
          )}
        </Flex>

        <Flex alignCenter>
          {address}
          {address.length > 0 && <Divider />}

          <MlsConnect deal={props.deal} />
        </Flex>
      </Flex>
    </Flex>
  )
}
