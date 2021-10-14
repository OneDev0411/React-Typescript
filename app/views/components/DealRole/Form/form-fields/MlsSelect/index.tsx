import { Box, TextField } from '@material-ui/core'
import { FieldInputProps } from 'react-final-form'

import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { UserAgentSelect } from '@app/views/components/UserAgentSelect'

interface Props {
  input: FieldInputProps<any, HTMLElement>
  agents: IAgent[]
  mutators: any // TODO: fix mutators types
}

export function MlsSelect({ input, mutators, agents }: Props) {
  const selectedAgent =
    agents.find(({ mlsid }) => input.value === mlsid) ?? agents[0]

  const handleChange = (agent: IAgent) => {
    mutators.populateRole(agent)
  }

  return (
    <BaseDropdown
      renderDropdownButton={buttonProps => (
        <TextField
          fullWidth
          label="MLS"
          variant="outlined"
          size="small"
          value={`${selectedAgent.mls} . ${selectedAgent.mlsid}`}
          InputProps={{
            readOnly: true
          }}
          style={{
            background: '#fff'
          }}
          {...buttonProps}
        />
      )}
      renderMenu={({ close }) => (
        <Box px={1} py={1} minWidth="400px">
          <UserAgentSelect
            agents={agents}
            defaultAgent={selectedAgent.id}
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
