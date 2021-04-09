import { Field } from 'react-final-form'
import { Grid, Box } from '@material-ui/core'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import uniq from 'lodash/uniq'

interface Props {
  fieldTitle: string
  fieldName: string
  brandPropertyTypes: IDealPropertyType[]
}

function AvailabilityFields({
  fieldTitle,
  fieldName,
  brandPropertyTypes
}: Props) {
  const items = uniq([
    'Buying',
    'Selling',
    ...brandPropertyTypes.map(propertyType => propertyType.label),
    'Active Offer'
  ])

  return (
    <Grid container alignItems="flex-start" spacing={1}>
      <Grid item xs={3}>
        <Box fontWeight={500}>{fieldTitle}</Box>
      </Grid>
      <Grid item xs={9}>
        <Grid container spacing={1}>
          <Grid container alignItems="center" item xs={12}>
            {items.map(label => (
              <Grid item xs={4} key={label}>
                <Field
                  name={fieldName}
                  type="checkbox"
                  value={label}
                  render={({ input }) => (
                    <FormControlLabel
                      label={label}
                      control={
                        <Checkbox
                          color="primary"
                          checked={input.checked}
                          onChange={input.onChange}
                        />
                      }
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default AvailabilityFields
