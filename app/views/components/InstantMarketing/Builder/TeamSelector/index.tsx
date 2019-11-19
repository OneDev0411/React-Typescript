import React from 'react'

import { TeamContactSelect } from 'components/TeamContact/TeamContactSelect'

import { AgentPickerButton } from './Button'

interface TemplateData {
  user?: IUser
  listing?: IListing
}

interface Props {
  templateData: TemplateData
  owner: IUser
  onSelect(user: IUser): void
}

export function TeamSelector({ templateData, owner, onSelect }: Props) {
  return (
    <TeamContactSelect
      fullHeight
      pullTo="left"
      user={templateData.user}
      owner={owner}
      onSelect={item => onSelect(item.value)}
      buttonRenderer={buttonProps => <AgentPickerButton {...buttonProps} />}
      style={{
        marginRight: '0.5rem'
      }}
    />
  )
}
