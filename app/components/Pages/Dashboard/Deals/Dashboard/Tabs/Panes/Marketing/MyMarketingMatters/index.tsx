import React, { useState, useEffect } from 'react'
import { withRouter, WithRouterProps } from 'react-router'
import { connect } from 'react-redux'
import { addNotification, Notification } from 'reapop'

import { Button } from '@material-ui/core'

import {
  Container,
  Title,
  Description,
  LeftColumn,
  RightColumn,
  Image
} from '../styled'
import { sendPunchOutRequest } from './helpers'

function getDealCostCenter(deal: IDeal): string | null {
  let costCenter: string | null = null
  let brand: IBrand | null = deal.brand

  while (brand) {
    if (brand.messages?.mmm_cost_center) {
      costCenter = brand.messages.mmm_cost_center
      break
    }

    brand = brand.parent
  }

  return costCenter
}

interface Props {
  deal: IDeal
  user: IUser
  notify: (notification: Notification) => any
}

function MyMarketingMatters({
  deal,
  user,
  notify,
  location
}: Props & WithRouterProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [costCenter, setCostCenter] = useState<null | string>(null)

  useEffect(() => {
    setCostCenter(getDealCostCenter(deal))
  }, [deal])

  async function onClick() {
    if (!costCenter) {
      return
    }

    setIsLoading(true)

    try {
      const result = await sendPunchOutRequest(
        user,
        deal,
        costCenter,
        location.pathname
      )

      if (result.response) {
        const newWindow = window.open(result.response.url, '_blank')

        newWindow && newWindow.focus()
      }
    } catch (err) {
      notify({
        status: 'error',
        message:
          'Something went wrong. Please try again or contact Rechat support.'
      })
      console.error(err)
    }

    setIsLoading(false)
  }

  // Only brands with mmm cost center are supported
  if (!costCenter) {
    return null
  }

  return (
    <Container style={{ marginBottom: '1.5rem' }}>
      <LeftColumn>
        <Title>Print Marketing, Postcards and Brochures</Title>
        <Description>
          Increase your marketing reach with direct mail postcards, newsletters,
          brochures, and more when you integrate with
          <br />
          My Marketing Matters.
        </Description>
        <Button
          variant="contained"
          color="secondary"
          onClick={onClick}
          disabled={isLoading}
        >
          Connect to My Marketing Matters
        </Button>
      </LeftColumn>
      <RightColumn>
        <Image
          style={{
            position: 'absolute',
            bottom: 0
          }}
          src="/static/images/deals/marketing/marketing-center-graphic@3x.png"
          alt=""
        />
      </RightColumn>
    </Container>
  )
}

export default withRouter(
  connect(null, { notify: addNotification })(MyMarketingMatters)
)
