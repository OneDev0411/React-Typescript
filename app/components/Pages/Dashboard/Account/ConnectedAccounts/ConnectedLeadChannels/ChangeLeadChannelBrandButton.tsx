import { useState } from 'react'

import { Button, CircularProgress } from '@material-ui/core'

import useNotify from '@app/hooks/use-notify'
import {
  BrandAvailableToUserSelectorDrawer,
  NodeRenderer
} from '@app/views/components/BrandSelector'

import { TeamSwitchBrandSelectorRenderer } from '../../../SideNav/components/UserMenu/ActiveTeam/components/TeamSwitchBrandSelectorRenderer'

import { useUpdateLeadChannelMutation } from './queries/use-update-lead-channel-mutation'

interface Props {
  channel: LeadChannel
  activeBrandId?: UUID
}

export function ChangeLeadChannelBrandButton({
  channel,
  activeBrandId
}: Props) {
  const [isBrandSelectorOpen, setIsBrandSelectorOpen] = useState(false)
  const [isWorking, setIsWorking] = useState(false)
  const { mutateAsync } = useUpdateLeadChannelMutation(channel, activeBrandId)
  const notify = useNotify()

  const handleChangeBrand = async (brand: IBrand) => {
    try {
      setIsWorking(true)
      await mutateAsync({
        brand: brand.id
      })

      notify({
        status: 'success',
        message: `The lead channel successfully moved to "${brand.name}"`
      })
    } catch (e) {
      notify({
        status: 'error',
        message:
          e.response.status === 401
            ? 'This channel was created by someone else. You cannot update its brand.'
            : 'Something went wrong. Please try again.'
      })
    } finally {
      setIsWorking(false)
    }
  }

  const renderBrandNode = ({ brand }: NodeRenderer) => {
    const isActive = activeBrandId === brand.id

    return (
      <TeamSwitchBrandSelectorRenderer
        brand={brand}
        isActive={isActive}
        disabled={isActive}
        isFetchingUser={false}
        onClick={(brand: IBrand) => {
          setIsBrandSelectorOpen(false)
          handleChangeBrand(brand)
        }}
      />
    )
  }

  return (
    <>
      <Button
        size="small"
        color="secondary"
        onClick={() => setIsBrandSelectorOpen(true)}
        startIcon={
          isWorking ? <CircularProgress size={20} color="inherit" /> : null
        }
        disabled={isWorking}
      >
        Change Brand
      </Button>

      {isBrandSelectorOpen && (
        <BrandAvailableToUserSelectorDrawer
          open
          drawerTitle="Select an Account"
          width="43rem"
          onClose={() => setIsBrandSelectorOpen(false)}
          brandSelectorProps={{
            shouldExpandOnNodeClick: true,
            nodeRenderer: renderBrandNode
          }}
        />
      )}
    </>
  )
}
