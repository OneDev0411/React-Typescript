import { Chip, makeStyles } from '@material-ui/core'
import cn from 'classnames'

import CellContainer from '@app/views/components/Grid/Table/features/cells/CellContainer'

import { CellProps } from '../../../types'

interface Props {
  attributes: IContactAttribute[]
  onSave?: (e: any) => void
  isRowSelected?: boolean
  countEnabled?: boolean
  attribute_type?: string
  attribute_label?: string
}

const useStyles = makeStyles(
  theme => ({
    attributeText: {
      ...theme.typography.body2,
      color: theme.palette.grey[700],
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`,
      '&.hovered': {
        color: theme.palette.tertiary.dark
      },
      '&.selected': {
        color: theme.palette.primary.main
      },
      '&.rowSelected': {
        color: theme.palette.tertiary.dark
      }
    },
    attributeLabel: {
      ...theme.typography.body3,
      letterSpacing: '0.4px',
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.grey['500'],
      '&.selected': {
        color: theme.palette.tertiary.dark
      }
    },
    chip: {
      letterSpacing: '0.2px'
    }
  }),
  { name: 'Attribute-cell' }
)

const AttributeCell = ({
  attributes,
  isRowSelected = false,
  countEnabled = false,
  attribute_type,
  attribute_label = 'Main'
}: Props) => {
  const classes = useStyles()

  let attribute
  let attributeLabel
  let count = 0

  //--

  const filteredAttributes = attributes.filter(attr => {
    if (!attr.is_partner && attr.attribute_type === attribute_type) {
      if (attr.is_primary) {
        attribute = attr.text
        attributeLabel = attr.label || attribute_label
      }

      return true
    }

    return false
  })

  if (filteredAttributes.length > 0) {
    if (!attribute) {
      attribute = filteredAttributes[0].text
      attributeLabel = filteredAttributes[0].label || 'Other'
    }

    count = filteredAttributes.length
  }

  //--

  const renderCellContent = ({
    isHovered = false,
    isSelected = false
  }: CellProps) => {
    return (
      <>
        {attribute && (
          <div
            className={cn(classes.attributeText, {
              hovered: isHovered,
              selected: isSelected,
              rowSelected: isRowSelected
            })}
          >
            {attribute}
          </div>
        )}

        {attributeLabel && (
          <div
            className={cn(classes.attributeLabel, {
              selected: isSelected
            })}
          >
            {attributeLabel}
          </div>
        )}

        {countEnabled && count > 1 && (
          <Chip
            className={classes.chip}
            variant="outlined"
            size="small"
            label={`${count - 1} more`}
          />
        )}
      </>
    )
  }

  return (
    <CellContainer actionsActivated renderCellContent={renderCellContent} />
  )
}

export default AttributeCell
