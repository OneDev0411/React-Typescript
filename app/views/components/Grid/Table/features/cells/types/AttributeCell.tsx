import { Chip, makeStyles } from '@material-ui/core'
import cn from 'classnames'

import CellContainer from '@app/views/components/Grid/Table/features/cells/CellContainer'

import { CellProps } from '../../../types'

interface Props {
  contact: IContact
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
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.grey['500'],
      '&.selected': {
        color: theme.palette.tertiary.dark
      }
    }
  }),
  { name: 'Attribute-cell' }
)

const AttributeCell = ({
  contact,
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

  const attributes = contact.attributes?.filter(attr => {
    if (!attr.is_partner && attr.attribute_type === attribute_type) {
      if (attr.is_primary) {
        attribute = attr.text
        attributeLabel = attr.label || attribute_label
      }

      return true
    }

    return false
  })

  if (attributes && attributes?.length > 0) {
    if (!attribute) {
      attribute = attributes[0].text
      attributeLabel = attributes[0].label
    }

    count = attributes.length
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
          <Chip variant="outlined" size="small" label={`${count} more`} />
        )}
      </>
    )
  }

  return <CellContainer renderCellContent={renderCellContent} />
}

export default AttributeCell
