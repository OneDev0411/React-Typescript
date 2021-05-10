import React from 'react'

import { TeamContactSelect } from '../../../../../../views/components/TeamContact/TeamContactSelect'
import { ItemChangelog } from '../../../../../../views/components/TeamContact/ItemChangelog'
import { isSoloActiveTeam } from '../../../../../../utils/user-teams'

import { BasicSection } from '../components/Section/Basic'

export function Owner(props) {
  if (props.user && isSoloActiveTeam(props.user)) {
    return null
  }

  return (
    <BasicSection>
      <TeamContactSelect
        {...props}
        upsideDown
        fullWidth
        style={{ marginBottom: '1em' }}
      />
      <ItemChangelog item={props.contact} />
    </BasicSection>
  )
}
