import { useState } from 'react'

import { Typography } from '@material-ui/core'
import { mdiMapMarker } from '@mdi/js'
import Flex from 'styled-flex-component'

import { AddressPopover } from 'components/inline-editable-fields/InlineAddressField/AddressPopover'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useStyles } from './styles'

interface Props {
  address: string
  onSelectAddress: (address: object) => void
}

export function ManualAddress({ address, onSelectAddress }: Props) {
  const classes = useStyles()
  const [isAddressPopoverOpen, setIsAddressPopoverOpen] = useState(false)

  const handleSelectAddress = (address: object) => {
    onSelectAddress(address)
    close()
  }

  const close = () => setIsAddressPopoverOpen(false)

  return (
    <>
      <Flex
        alignCenter
        className={classes.resultItem}
        onClick={() => setIsAddressPopoverOpen(true)}
      >
        <Flex alignCenter justifyCenter className={classes.avatarContainer}>
          <SvgIcon path={mdiMapMarker} />
        </Flex>

        <Typography variant="body2" className={classes.resultItemContent}>
          <strong>{address}</strong>
        </Typography>
      </Flex>

      <AddressPopover
        isOpen={isAddressPopoverOpen}
        address={address}
        showDeleteButton={false}
        PopoverProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          },
          transformOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          }
        }}
        preSaveFormat={handleSelectAddress}
        onClose={close}
        onSubmit={close}
      />
    </>
  )
}
