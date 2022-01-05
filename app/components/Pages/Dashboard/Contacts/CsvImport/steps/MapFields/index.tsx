import { Grid, makeStyles, Theme, Typography } from '@material-ui/core'
import cn from 'classnames'

import { AttributeDropdown } from '../../components/AttributeDropdown'
import { LabelDropdown } from '../../components/LabelDropdown'
import { getCsvColumns } from '../../helpers/get-csv-columns'
import { useAutoMapFields } from '../../hooks/use-auto-map'
import { useImportCsv } from '../../hooks/use-import-csv'
import { AttributeOption, MappedField } from '../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    row: {
      marginBottom: theme.spacing(2),
      '&.heading': {
        marginBottom: theme.spacing(4)
      }
    }
  }),
  {
    name: 'ImportCsv-MapFields'
  }
)

export function MapFields() {
  const classes = useStyles()
  const { csv } = useImportCsv()
  const [fields, setFields] = useAutoMapFields(csv)

  const handleSelect = (column: string, option: AttributeOption) => {
    setFields(state => ({
      ...state,
      [column]: {
        index: option.index,
        type: option.type,
        attributeTypeName:
          option.type === 'attribute_type' && option.attributeTypeName,
        attributeDefId: option.type === 'attribute_def' && option.attributeDefId
      }
    }))
  }

  console.log('>> MAPPED: ', fields)

  return (
    <>
      <Grid container spacing={1} className={cn(classes.row, 'heading')}>
        <Grid item xs={4}>
          <Typography variant="subtitle1">Columns Label From CSV</Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography variant="subtitle1">Rechat Property</Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography variant="subtitle1">Assign Label</Typography>
        </Grid>
      </Grid>

      {getCsvColumns(csv).map((column, key) => (
        <Grid key={key} container spacing={1} className={classes.row}>
          <Grid item xs={4}>
            {column}
          </Grid>

          <Grid item xs={4}>
            <AttributeDropdown
              fields={fields}
              column={column}
              onSelect={option => handleSelect(column, option)}
            />
          </Grid>

          <Grid item xs={4}>
            <LabelDropdown
              fields={fields}
              column={column}
              onSelect={() => {}}
            />
          </Grid>
        </Grid>
      ))}
    </>
  )
}
