import React from 'react'
import { Button } from '@material-ui/core'

import config from '../../../../../../../config/public'

interface Props {
  activeBrandId: UUID
  openHouse: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
}

export default function GuestRegistration({ activeBrandId, openHouse }: Props) {
  const registerPageURL = `${config.app.url}/openhouse/${
    openHouse.id
  }/${activeBrandId}/register`

  return (
    <Button variant="outlined" onClick={() => window.open(registerPageURL)}>
      Guest Registration Page
    </Button>
  )
}
