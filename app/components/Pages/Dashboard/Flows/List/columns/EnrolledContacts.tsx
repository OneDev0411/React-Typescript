import React from 'react'

interface Props {
  activeFlows: number
}

export default function({ activeFlows }: Props) {
  return <div>{activeFlows}</div>
}
