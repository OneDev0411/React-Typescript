import React from 'react'

import { Button, useTheme, Theme } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { SocialNetworkShare } from '../types'

interface Props {
  networks: SocialNetworkShare[]
  onClick: (networkName: string) => void
  disabled?: boolean
}

export default function SocialActions({
  networks,
  onClick,
  disabled = false
}: Props) {
  const theme = useTheme<Theme>()

  return (
    <>
      {networks.map(network => (
        <Button
          key={network.name}
          variant="contained"
          color="primary"
          style={{ marginLeft: '0.5rem' }}
          onClick={() => onClick(network.name)}
          disabled={disabled}
        >
          <SvgIcon
            path={network.icon}
            style={{
              marginRight: theme.spacing(1)
            }}
          />
          Post to {network.name}
        </Button>
      ))}
    </>
  )
}
