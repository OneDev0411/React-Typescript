import React, { Fragment } from 'react'

import RadioButton from '../../../../../../views/components/radio'
import { SectionTitle } from '../styled'

const radioButtonStyle = { display: 'block', marginBottom: '2rem' }

const TeamTypes = ({ userTeams, selectedBrandId, onChangeTeam }) => (
  <Fragment>
    <SectionTitle>
      Which team did you want to send calendar events from?
    </SectionTitle>
    <RadioButton
      selected={!selectedBrandId}
      title="All Teams"
      onClick={() => onChangeTeam(null)}
      style={radioButtonStyle}
    />
    {userTeams.map(team => (
      <RadioButton
        key={team.brand.id}
        selected={selectedBrandId === team.brand.id}
        title={team.brand.name}
        onClick={() => onChangeTeam(team.brand.id)}
        style={radioButtonStyle}
      />
    ))}
  </Fragment>
)

export default TeamTypes
