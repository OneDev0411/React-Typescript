import React, { useState, useEffect } from 'react'
import { withRouter, WithRouterProps } from 'react-router'
import { connect } from 'react-redux'
import { addNotification, Notification } from 'reapop'

import { isSelling } from 'models/Deal/helpers/context/get-side'
import { getActiveTeam } from 'utils/user-teams'

import ActionButton from 'components/Button/ActionButton'

import {
  Container,
  Title,
  Description,
  LeftColumn,
  RightColumn,
  Image
} from '../styled'
import { sendPunchOutRequest } from './helpers'

function getUserCostCenter(user: IUser): string | null {
  const team = getActiveTeam(user)

  let costCenter: string | null = null
  let brand: IBrand | null = team && team.brand

  while (brand) {
    if (brand && brand.messages && brand.messages.mmm_cost_center) {
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
    setCostCenter(getUserCostCenter(user))
  }, [user])

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

  // Only selling deal types for brands with mmm cost centers are supported
  if (!isSelling(deal) || !costCenter) {
    return null
  }

  return (
    <Container style={{ marginBottom: '1.5rem' }}>
      <LeftColumn>
        <Title>Direct Mail Marketing made Easier</Title>
        <Description>
          Increase your marketing reach with direct mail postcards, newsletters,
          brochures, and more when you integrate with
          <br />
          My Marketing Matters.
        </Description>
        <ActionButton onClick={onClick} disabled={isLoading}>
          Connect to My Marketing Matters
        </ActionButton>
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
  connect(
    null,
    { notify: addNotification }
  )(MyMarketingMatters)
)
