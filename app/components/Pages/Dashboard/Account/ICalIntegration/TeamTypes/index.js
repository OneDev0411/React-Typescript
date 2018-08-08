import React, { Fragment } from 'react'
import { Header } from '../styled'
import RadioButton from '../../../../../../views/components/radio'

const radioButtonStyle = { display: 'block', marginTop: '2rem' }

const TeamTypes = ({ userTeams, selectedBrandId, onChangeTeam }) => (
  <Fragment>
    <Header>Which team did you want to send calendar events from?</Header>
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
