import { CircularProgress, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { useStyles } from '../../styles'

interface Props {
  type: SchoolType
  schools: ISchool[]
  value: Nullable<string[]> | undefined
  onChange: (newValue: string[], school_type: SchoolType) => void
  loading: boolean
  label: string
  placeholder: string
}

export const SchoolSelector = ({
  type,
  schools,
  value,
  onChange,
  loading,
  label,
  placeholder
}: Props) => {
  const classes = useStyles()

  return (
    <Autocomplete
      className={classes.select}
      classes={{ popper: 'u-scrollbar--thinner' }}
      id={`${type}-school-selector`}
      options={schools.map(school => school.name)}
      size="small"
      autoHighlight
      multiple
      limitTags={1}
      value={value || []}
      onChange={(event, value) => onChange(value, type)}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  )
}
