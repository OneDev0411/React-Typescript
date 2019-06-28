import React, { Fragment } from 'react'
import Flex from 'styled-flex-component'
import { Link } from 'react-router'

import { getDealAddress } from 'deals/utils/get-deal-address'

import { ListingImage } from './Image'
import MlsConnect from './MlsConnect'
import Side from './Side'
import PropertyType from './PropertyType'
import Address from './Address'

import { Divider } from '../styled'

export function ListingInfo(props) {

  const address = getDealAddress(props.deal)

  return (
    <React.Fragment>
      <Flex alignCenter>
        <ListingImage deal={props.deal} />

        <Flex column style={{ padding: '0.5em 1.5em' }}>
          <Flex alignCenter>
            <Address deal={props.deal} />
          </Flex>

          <Flex alignCenter>
            {address}
            {address.length > 0 && <Divider small />}

            <Side deal={props.deal} isBackOffice={props.isBackOffice} />
            <Divider small />

            <PropertyType deal={props.deal} isBackOffice={props.isBackOffice} />
            <Divider small />

            <MlsConnect deal={props.deal} />

            {props.deal.listing && (
              <Fragment>
                <Divider small />
                <Link to={`/dashboard/mls/${props.deal.listing}`}>
                  View MLS
                </Link>
              </Fragment>
            )}
          </Flex>
        </Flex>
      </Flex>
    </React.Fragment>
  )
}
