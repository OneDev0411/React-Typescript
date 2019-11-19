import { ACL } from 'constants/acl'

import React from 'react'
import Flex from 'styled-flex-component'
import { browserHistory } from 'react-router'

import Acl from 'components/Acl'

import LinkButton from 'components/Button/LinkButton'
import { CloseButton } from 'components/Button/CloseButton'
import SendEmail from 'components/SendEmailButton'

import YardSign from 'deals/components/YardSign'
import OpenHouse from 'deals/components/OpenHouse'

import { RemoveDraft } from './RemoveDraft'

import DealStatus from '../../../components/DealStatus'

import { Divider } from '../../styled'

export function Menu(props) {
  const { deal } = props

  return (
    <Flex style={{ padding: '1.5em 0' }}>
      {deal.is_draft === true && <RemoveDraft deal={deal} />}

      <Acl access={ACL.BETA}>
        <>
          {deal.deal_type === 'Selling' && (
            <OpenHouse
              deal={deal}
              style={{ marginLeft: '0.5rem' }}
              defaultOpen={
                browserHistory.getCurrentLocation().query.createOpenHouse
              }
            />
          )}

          {deal.deal_type === 'Selling' && (
            <YardSign deal={deal} style={{ marginLeft: '0.5rem' }} />
          )}
        </>
      </Acl>

      <SendEmail deal={deal} style={{ marginLeft: '0.5rem' }} />

      {deal.deal_type === 'Selling' && !deal.has_active_offer && (
        <LinkButton
          style={{ marginLeft: '0.5rem' }}
          to={`/dashboard/deals/${deal.id}/create-offer`}
          appearance="outline"
        >
          Add Offer
        </LinkButton>
      )}

      <DealStatus
        deal={deal}
        isBackOffice={props.isBackOffice}
        style={{ marginLeft: '0.5rem' }}
      />

      <Flex style={{ paddingTop: '0.5rem' }}>
        <Divider />
        <CloseButton
          isFit
          iconSize="large"
          inverse
          backUrl="/dashboard/deals"
        />
      </Flex>
    </Flex>
  )
}
