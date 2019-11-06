import React from 'react'

import { SocialNetworkShare } from '../types'

import { Button, Icon } from './styled'

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
          onClick={() => onClick(network.name)}
          style={{ height: '2rem', lineHeight: 0 }}
        >
          <Icon className={network.className} />
          Post to {network.name}
        </Button>
      ))}
    </>
  )
}
