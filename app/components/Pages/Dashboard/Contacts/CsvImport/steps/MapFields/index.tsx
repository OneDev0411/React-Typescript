import { Dispatch, SetStateAction } from 'react'

import { Grid, makeStyles, Theme, Typography } from '@material-ui/core'
import cn from 'classnames'

import { AttributeDropdown } from '../../components/AttributeDropdown'
import { LabelDropdown } from '../../components/LabelDropdown'
import { convertOptionToAttribute } from '../../helpers/convert-option-to-attribute'
import { getCsvColumns } from '../../helpers/get-csv-columns'
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

interface Props {
  setMappedFields: Dispatch<
    SetStateAction<Record<string, Nullable<MappedField>>>
  >
}

export function MapFields({ setMappedFields }: Props) {
  const classes = useStyles()
  const { csv, mappedFields } = useImportCsv()

  const handleSelectAttribute = (column: string, option: AttributeOption) => {
    const attribute = convertOptionToAttribute(option)

    if (!attribute) {
      return null
    }

    setMappedFields(state => ({
      ...state,
      [column]: {
        ...attribute,
        index: option.index,
        multiValued: option.multiValued,
        isPartner: option.isPartner
      } as MappedField
    }))
  }

  const handleRemoveAttribute = (column: string) => {
    setMappedFields(state => ({
      ...state,
      [column]: null
    }))
  }

  const handleSelectLabel = (column: string, label: string) => {
    return setMappedFields(state => ({
      ...state,
      [column]: {
        ...(state[column] as MappedField),
        label
      }
    }))
  }

  const handleRemoveLabel = (column: string) => {
    return setMappedFields(state => ({
      ...state,
      [column]: {
        ...(state[column] as MappedField),
        label: undefined
      }
    }))
  }

  return (
    <div>
      <Grid container spacing={5} className={cn(classes.row, 'heading')}>
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
        <Grid key={key} container spacing={5} className={classes.row}>
          <Grid item xs={4}>
            {column}
          </Grid>

          <Grid item xs={4}>
            <AttributeDropdown
              fields={mappedFields}
              column={column}
              onSelect={option => handleSelectAttribute(column, option)}
              onRemove={() => handleRemoveAttribute(column)}
            />
          </Grid>

          <Grid item xs={4}>
            <LabelDropdown
              fields={mappedFields}
              column={column}
              onSelect={label => handleSelectLabel(column, label)}
              onRemove={() => handleRemoveLabel(column)}
            />
          </Grid>
        </Grid>
      ))}
    </div>
  )
}
