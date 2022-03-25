import { useState } from 'react'

import { Box, TextField } from '@material-ui/core'
import { omit } from 'lodash'
import { FieldInputProps, FieldMetaState } from 'react-final-form'
import { useEffectOnce } from 'react-use'

import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { UserAgentSelect } from '@app/views/components/UserAgentSelect'

interface Props {
  input: FieldInputProps<any, HTMLElement>
  agents: IAgent[]
  meta: FieldMetaState<any>
  isRequired: boolean
  fieldToSelect: keyof IAgent
  mutators: any // TODO: fix mutators types
}

export function MlsSelect({
  input,
  meta,
  fieldToSelect = 'mlsid',
  mutators,
  agents,
  isRequired
}: Props) {
  const [selectedAgent, setSelectedAgent] = useState<IAgent | undefined>()

  useEffectOnce(() => {
    const agent = agents.find(
      agent => input.value?.[fieldToSelect] === agent[fieldToSelect]
    )

    setSelectedAgent(agent)
  })

  const handleChange = (agent: IAgent) => {
    mutators.populateRole(agent, 'MlsSelect')
  }

  return (
    <BaseDropdown
      renderDropdownButton={buttonProps => (
        <TextField
          fullWidth
          label={selectedAgent ? '' : `MLS ${isRequired ? '*' : ''}`}
          variant="outlined"
          error={meta.error || (isRequired && !selectedAgent)}
          size="small"
          value={
            selectedAgent
              ? `${selectedAgent.mls} . ${selectedAgent.mlsid}`
              : null
          }
          InputProps={{
            readOnly: true
          }}
          style={{
            background: '#fff'
          }}
          {...omit(buttonProps, 'component')}
        />
      )}
      renderMenu={({ close }) => (
        <Box px={1} py={1} minWidth="400px">
          <UserAgentSelect
            agents={agents}
            defaultAgent={selectedAgent?.id}
            onChange={agent => {
              handleChange(agent)
              close()
            }}
          />
        </Box>
      )}
    />
  )
}
