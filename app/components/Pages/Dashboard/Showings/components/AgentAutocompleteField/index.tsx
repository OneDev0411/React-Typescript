import searchAgents from 'models/agent/search'

import AutocompleteField, {
  BaseOption,
  AutocompleteFieldProps
} from '../AutocompleteField'

type AgentOption = BaseOption & IAgent

export interface AgentAutocompleteFieldProps
  extends Omit<
    AutocompleteFieldProps<AgentOption>,
    'options' | 'noOptionsText'
  > {
  searchFieldValue: keyof IAgent
  searchFieldLabel?: keyof IAgent
}

function AgentAutocompleteField({
  searchFieldValue,
  searchFieldLabel = 'full_name',
  ...otherProps
}: AgentAutocompleteFieldProps) {
  const getOptions = async (value: string) => {
    if (!value || value.length < 3) {
      return []
    }

    const agents = await searchAgents(value, 'q')

    return agents.map<AgentOption>(agent => ({
      ...agent,
      value: agent[searchFieldValue] as string,
      label: agent[searchFieldLabel] as string
    }))
  }

  return (
    <AutocompleteField
      {...otherProps}
      options={getOptions}
      noOptionsText={loading =>
        loading ? 'Searching MLS agents' : 'Type to search MLS agents'
      }
    />
  )
}

export default AgentAutocompleteField
