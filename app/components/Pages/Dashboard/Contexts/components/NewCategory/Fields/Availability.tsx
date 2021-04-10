import {
  Box,
  Grid,
  Button,
  makeStyles,
  Theme,
  Typography,
  ButtonProps,
  useTheme
} from '@material-ui/core'
import cn from 'classnames'
import { Field } from 'react-final-form'

interface Props {
  context: IDealBrandContext | null
  brandPropertyTypes: IDealPropertyType[]
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    center: {
      textAlign: 'center'
    },
    row: {
      marginTop: theme.spacing(1)
    }
  }),
  {
    name: 'ContextsAdmin-AvailabilityFields'
  }
)

export function AvailabilityFields({ context, brandPropertyTypes }: Props) {
  const classes = useStyles()
  const theme = useTheme<Theme>()

  const getNextState = (current: boolean | null | ''): boolean | null => {
    if (current === null || current === '') {
      return true
    }

    if (current === true) {
      return false
    }

    return null
  }

  const getButtonLabel = (status: boolean | null): string => {
    if (status === true) {
      return 'Required'
    }

    if (status === false) {
      return 'Optional'
    }

    return 'Not Applicable'
  }

  const getButtonColor = (status: boolean | null): string => {
    if (status === true) {
      return theme.palette.error.main
    }

    if (status === false) {
      return theme.palette.secondary.main
    }

    return theme.palette.common.black
  }

  const getDefaultValue = (checklist: IBrandChecklist) => {
    if (!context) {
      return null
    }

    const isOptional = checklist.optional_contexts?.some(
      item => item.key === context.key
    )

    if (isOptional) {
      return false
    }

    const isRequired = checklist.required_contexts?.some(
      item => item.key === context.key
    )

    if (isRequired) {
      return true
    }

    return null
  }

  return (
    <Box>
      <Grid container spacing={1} className={cn(classes.center, classes.row)}>
        <Grid item xs={3} />

        <Grid item xs={3}>
          <Typography variant="h6">Listing</Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="h6">Contract</Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="h6">Offer</Typography>
        </Grid>
      </Grid>

      {brandPropertyTypes
        .filter(propertyType => Array.isArray(propertyType.checklists))
        .map((propertyType, index) => (
          <Grid key={index} container spacing={1} className={classes.row}>
            <Grid item xs={3}>
              {propertyType.label}
            </Grid>

            {propertyType.checklists?.map(checklist => (
              <Grid key={checklist.id} item xs={3} className={classes.center}>
                <Field
                  name={`checklists[${checklist.id}]`}
                  defaultValue={getDefaultValue(checklist)}
                  render={({ input }) => (
                    <Button
                      style={{
                        color: getButtonColor(input.value)
                      }}
                      onClick={() => input.onChange(getNextState(input.value))}
                    >
                      {getButtonLabel(input.value)}
                    </Button>
                  )}
                />
              </Grid>
            ))}
          </Grid>
        ))}
    </Box>
  )
}
