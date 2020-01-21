import React from 'react'
import { Field } from 'react-final-form'
import { Grid, Box } from '@material-ui/core'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

interface Props {
  fieldTitle: string
  fieldName: string
}

function AvailabilityFields({ fieldTitle, fieldName }: Props) {
  const items = [
    'Buying',
    'Selling',
    'Resale',
    'New Home',
    'Lot / Land',
    'Residential Lease',
    'Commercial Sale',
    'Commercial Lease',
    'Active Offer'
  ]

  return (
    <Grid container alignItems="flex-start" spacing={1}>
      <Grid item xs={3}>
        <Box fontWeight={500}>{fieldTitle}</Box>
      </Grid>
      <Grid item xs={9}>
        <Grid container spacing={1}>
          <Grid container alignItems="center" item xs={12}>
            {items.map(i => (
              <Grid item xs={4} key={i}>
                <Field
                  name={fieldName}
                  type="checkbox"
                  value={i}
                  render={({ input }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={input.checked}
                          onChange={input.onChange}
                        />
                      }
                      label={i}
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
