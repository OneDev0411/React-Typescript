import { Button } from '@material-ui/core'

interface Props {
  activeBrandId: UUID
  openHouse: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
}

export default function GuestRegistration({ activeBrandId, openHouse }: Props) {
  // eslint-disable-next-line max-len
  const registerPageURL = `/openhouse/${openHouse.id}/${activeBrandId}/register`

  return (
    <Button variant="outlined" onClick={() => window.open(registerPageURL)}>
      Guest Registration Page
    </Button>
  )
}
