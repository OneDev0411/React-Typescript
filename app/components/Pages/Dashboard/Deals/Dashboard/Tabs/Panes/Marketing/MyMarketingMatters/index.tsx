import React, { useState, useEffect } from 'react'
import { withRouter, WithRouterProps } from 'react-router'

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

interface Props {
  deal: IDeal
  user: IUser
}

function getUserCostCenter(user: IUser): string | null {
  const team = getActiveTeam(user)

  let costCenter: null | string = null
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

function MyMarketingMatters({
  deal,
  user,
  location,
  router
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

    const result = await sendPunchOutRequest(
      user,
      deal,
      costCenter,
      location.pathname
    )

    setIsLoading(false)

    window.location.replace(result.response.url)
  }

  // Only selling deal types are supported
  if (!isSelling(deal)) {
    return null
  }

  // Only the brands with mmm cost center are allowed
  if (!costCenter) {
    return null
  }

  return (
    <Container style={{ marginBottom: '1.5rem' }}>
      <LeftColumn>
        <Title>Design, Print and Mail</Title>
        <Description>
          Mail your property with our integration with My Marketing Matters®
        </Description>
        <ActionButton onClick={onClick} disabled={isLoading}>
          Open in My Marketing Matters®
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

export default withRouter(MyMarketingMatters)
