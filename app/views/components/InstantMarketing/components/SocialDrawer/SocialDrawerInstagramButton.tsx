import { useState } from 'react'

import { Button } from '@material-ui/core'
import { mdiInstagram } from '@mdi/js'

import { ACL } from '@app/constants/acl'
import { useGetActiveBrandFacebookPages } from '@app/models/facebook'
import { useAcl } from '@app/views/components/Acl/use-acl'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import ConnectToInstagramDialog from './ConnectToInstagramDialog'

interface SocialDrawerInstagramButtonProps {
  disabled?: boolean
  onClick: () => void
}

function SocialDrawerInstagramButton({
  disabled = false,
  onClick
}: SocialDrawerInstagramButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const hasAccess = useAcl(ACL.SHARE_TO_INSTAGRAM)

  const { data: facebookPages, isLoading } = useGetActiveBrandFacebookPages()
  const hasAnyAccounts = !!facebookPages?.length

  const openDialog = () => setIsDialogOpen(true)

  const closeDialog = () => setIsDialogOpen(false)

  const handleClick = () => {
    if (hasAnyAccounts) {
      onClick()

      return
    }

    openDialog()
  }

  const handleAuthSuccess = () => {
    closeDialog()
    onClick()
  }

  return (
    <>
      <Button
        startIcon={<SvgIcon path={mdiInstagram} size={muiIconSizes.small} />}
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleClick}
        disabled={isLoading || !hasAccess || disabled}
      >
        Instagram ...
      </Button>
      <ConnectToInstagramDialog
        open={isDialogOpen}
        onClose={closeDialog}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  )
}

export default SocialDrawerInstagramButton
