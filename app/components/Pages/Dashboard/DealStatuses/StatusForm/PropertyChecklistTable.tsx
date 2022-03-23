import {
  Box,
  Grid,
  Checkbox,
  Typography,
  makeStyles,
  Theme,
  CircularProgress
} from '@material-ui/core'
import cn from 'classnames'
import { Controller, Control, FieldValues } from 'react-hook-form'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { useBrandPropertyTypes } from 'hooks/use-get-brand-property-types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    center: {
      padding: 0,
      textAlign: 'center'
    },
    row: {
      marginTop: theme.spacing(0.5)
    }
  }),
  {
    name: 'DealStatuses-PropertyChecklistTable'
  }
)

interface Props {
  status: IDealStatus | undefined
  formControl: Control<FieldValues>
}

export function PropertyChecklistTable({ status, formControl }: Props) {
  const classes = useStyles()

  const activeBrandId = useActiveBrandId()
  const { propertyTypes } = useBrandPropertyTypes(activeBrandId)

  if (propertyTypes.length === 0) {
    return (
      <Box
        display="flex"
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Grid container spacing={1} className={cn(classes.center, classes.row)}>
        <Grid item xs={3} />

        <Grid item xs={3}>
          <Typography variant="body1">
            <strong>Listing</strong>
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">
            <strong>Contract</strong>
          </Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="body1">
            <strong>Offer</strong>
          </Typography>
        </Grid>
      </Grid>

      {propertyTypes
        .filter(propertyType => Array.isArray(propertyType.checklists))
        .map((propertyType, index) => (
          <Grid key={index} container spacing={1} className={classes.row}>
            <Grid item xs={3}>
              <Typography variant="body1">
                <strong>{propertyType.label}</strong>
              </Typography>
            </Grid>

            {(propertyType.checklists || [])
              .filter(checklist => checklist.brand === activeBrandId)
              .sort((a, b) => {
                const checklistsTypes = ['Selling', 'Buying', 'Offer']

                return (
                  checklistsTypes.indexOf(a.checklist_type) -
                  checklistsTypes.indexOf(b.checklist_type)
                )
              })
              .map(checklist => (
                <Grid key={checklist.id} item xs={3} className={classes.center}>
                  <Controller
                    control={formControl}
                    name={`checklists[${checklist.id}]`}
                    defaultValue={(checklist.statuses || []).some(
                      ({ id }) => id === status?.id
                    )}
                    render={({ value, onChange }) => (
                      <Checkbox
                        color="primary"
                        checked={value}
                        onChange={e => onChange(e.target.checked)}
                      />
                    )}
                  />
                </Grid>
              ))}
          </Grid>
        ))}
    </>
  )
}
