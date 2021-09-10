import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { useStyles } from '../../styles'
import { EditorGroup } from '../EditorGroup'

export const MlsAreaGroup = () => {
  const classes = useStyles()

  return (
    <EditorGroup title="MLS Areas">
      <Autocomplete
        className={classes.select}
        id="area-select"
        options={areas}
        size="small"
        autoHighlight
        getOptionLabel={option => option.label}
        renderOption={option => option.label}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Area"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password' // disable autocomplete and autofill
            }}
          />
        )}
      />
      <Autocomplete
        className={classes.select}
        id="country-select"
        options={Counties}
        size="small"
        autoHighlight
        getOptionLabel={option => option.label}
        renderOption={option => option.label}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Counties"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password' // disable autocomplete and autofill
            }}
          />
        )}
      />
    </EditorGroup>
  )
}

// TODO: Get MLS area and Contry data from API
interface Area {
  code: string
  label: string
}

const areas: Area[] = [
  { code: '1', label: 'Cedar Hill Area' },
  { code: '2', label: 'Desoto Area' },
  { code: '3', label: 'Lancaster Area' }
]

interface County {
  code: string
  label: string
}

const Counties: County[] = [{ code: 'WA', label: 'Whashington' }]
