import React from 'react'

import { Button } from '@material-ui/core'

import { SocialNetworkShare } from '../types'

interface Props {
  networks: SocialNetworkShare[]
  onClick: (networkName: string) => void
}

export default function SocialActions({ networks, onClick }: Props) {
  return (
    <>
      {networks.map(network => (
        <Button
          key={network.name}
          variant="contained"
          color="primary"
          style={{ marginLeft: '0.5rem' }}
          onClick={() => onClick(network.name)}
        >
          <i
            className={network.className}
            style={{
              fontSize: '1.5rem',
              marginRight: '0.5rem'
            }}
          />
          Post to {network.name}
        </Button>
      ))}
    </>
  )
}
