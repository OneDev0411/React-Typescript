import React, { Fragment } from 'react'
import Flex from 'styled-flex-component'

import { Link } from 'react-router'

import { H1 } from 'components/Typography/headings'

import Deal from 'models/Deal'

import Tooltip from 'components/tooltip'

import { ListingImage } from './Image'
import MlsConnect from './MlsConnect'
import Side from './Side'
import Address from '../../components/Address'

import { getDealTitle } from '../../utils/get-deal-title'

import { Divider } from '../styled'
import { TitleContainer } from './styled'

export class ListingInfo extends React.Component {
  state = {
    isAddressDrawerOpen: false
  }

  handleCloseAddressDrawer = () => {
    this.setState({
      isAddressDrawerOpen: false
    })
  }

  handleOpenAddressDrawer = () => {
    if (this.props.deal.listing) {
      return false
    }

    this.setState({
      isAddressDrawerOpen: true
    })
  }

  getAddress = deal => {
    const city = Deal.get.field(deal, 'city') || ''
    const state = Deal.get.field(deal, 'state') || ''
    const zipcode = Deal.get.field(deal, 'postal_code') || ''

    if ([city, state, zipcode].join('').length === 0) {
      return ''
    }

    return `${city}, ${state} ${zipcode}`
  }

  render() {
    const { props, state } = this
    const address = this.getAddress(props.deal)

    return (
      <React.Fragment>
        <Flex alignCenter>
          <ListingImage deal={props.deal} />

          <Flex column style={{ padding: '0.5em 1.5em' }}>
            <Flex alignCenter>
              <Tooltip
                captionIsHTML
                isCustom={false}
                caption={
                  props.deal.listing && (
                    <React.Fragment>
                      <img src="/static/images/deals/lock.svg" alt="locked" />
                      <div>
                        Listing information can only be changed on MLS. Once
                        changed, the update will be reflected here.
                      </div>
                    </React.Fragment>
                  )
                }
                placement="bottom"
                multiline
              >
                <TitleContainer
                  onClick={this.handleOpenAddressDrawer}
                  editable={!props.deal.listing}
                >
                  <H1 style={{ lineHeight: 1.5 }}>
                    {getDealTitle(props.deal)}
                  </H1>
                </TitleContainer>
              </Tooltip>
            </Flex>

            <Flex alignCenter>
              {address}
              {address.length > 0 && <Divider small />}

              <Side deal={props.deal} isBackOffice={this.props.isBackOffice} />
              <Divider small />

              {props.deal.property_type}
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

        <Address
          deal={props.deal}
          show={state.isAddressDrawerOpen}
          onClose={this.handleCloseAddressDrawer}
        />
      </React.Fragment>
    )
  }
}
