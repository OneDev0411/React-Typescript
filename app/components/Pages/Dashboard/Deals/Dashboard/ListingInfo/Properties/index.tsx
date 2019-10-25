import React from 'react'

import Flex from 'styled-flex-component'

import { Link } from 'react-router'

import { getDealAddress } from 'deals/utils/get-deal-address'

import MlsConnect from './MlsConnect'
import Side from './Side'
import PropertyType from './PropertyType'

import { Divider } from '../../styled'

interface Props {
  deal: IDeal
  isBackOffice: boolean
}

export function ListingProperties(props: Props) {
  const address = getDealAddress(props.deal)

  return (
    <Flex alignCenter style={{ paddingLeft: '5rem' }}>
      {address}
      {address.length > 0 && <Divider small />}

      {/* 
      // @ts-ignore js component */}
      <Side deal={props.deal} isBackOffice={props.isBackOffice} />

      <Divider small />

      {/* 
      // @ts-ignore js component */}
      <PropertyType deal={props.deal} isBackOffice={props.isBackOffice} />

      <Divider small />

      {/* 
      // @ts-ignore js component */}
      <MlsConnect deal={props.deal} />

      {props.deal.listing && (
        <>
          <Divider small />
          <Link to={`/dashboard/mls/${props.deal.listing}`}>View MLS</Link>
        </>
      )}
    </Flex>
  )
}
