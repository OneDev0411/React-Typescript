import React from 'react'

import { Grid, Box } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Field } from 'react-final-form'

import { MUITextInput } from 'components/Forms/MUITextInput'

function DetailsFields() {
  return (
    <Grid container alignItems="flex-start" spacing={1}>
      <Grid item xs={3}>
        <Box fontWeight={500}>Options</Box>
      </Grid>
      <Grid item xs={9}>
        <Grid container spacing={1}>
          <Grid container alignItems="center" item xs={12}>
            <Grid item xs={6}>
              <Field
                name="needs_approval"
                render={({ input }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={input.checked}
                        onChange={input.onChange}
                      />
                    }
                    label="Requires Back Office Approval"
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Field
                name="preffered_source"
                render={({ input }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={input.value === 'MLS'}
                        onChange={() =>
                          input.onChange(
                            !input.value || input.value === 'Provided'
                              ? 'MLS'
                              : 'Provided'
                          )
                        }
                      />
                    }
                    label="MLS Value Preferred (If Available)"
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Field
                name="exports"
                render={({ input }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={input.checked}
                        onChange={input.onChange}
                      />
                    }
                    label="Export in CSV"
                  />
                )}
              />
            </Grid>

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
