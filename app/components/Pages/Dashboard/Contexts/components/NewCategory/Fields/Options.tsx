import React from 'react'
import { Field } from 'react-final-form'
import { Grid, Box } from '@material-ui/core'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import { MUITextInput } from 'components/Forms/MUITextInput'

interface Props {}

function DetailsFields(props: Props) {
  const options = [
    {
      name: 'needs_approval',
      lable: 'Requires Back Office Approval'
    },
    {
      name: 'preffered_source',
      lable: 'MLS Value Prefrred (If Available)'
    },
    {
      name: 'exports',
      lable: 'Export in CSV'
    }
  ]

  return (
    <Grid container alignItems="flex-start" spacing={1}>
      <Grid item xs={3}>
        <Box fontWeight={500}>Options</Box>
      </Grid>
      <Grid item xs={9}>
        <Grid container spacing={1}>
          <Grid container alignItems="center" item xs={12}>
            {options.map(ch => (
              <Grid item xs={6} key={ch.name}>
                <Field
                  name={ch.name}
                  type="checkbox"
                  render={({ input }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={input.checked}
                          onChange={input.onChange}
                        />
                      }
                      label={ch.lable}
                    />
                  )}
                />
              </Grid>
            ))}
            <Grid item xs={6}>
              <Field
                name="default_value"
                label="Default Value"
                variant="filled"
                InputLabelProps={{
                  shrink: true
                }}
                margin="dense"
                autoComplete="off"
                fullWidth
                component={MUITextInput}
              />
            </Grid>
          </Grid>
          <Grid container alignItems="center" item xs={12} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default DetailsFields
