import { makeStyles } from '@material-ui/core'
import cn from 'classnames'

import CellContainer from '@app/views/components/Grid/Table/features/cells/CellContainer'

import { CellProps } from '../../types'

interface Props {
  contact: IContact
  onSave?: (e: any) => void
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
      }
    },
    attributeLabel: {
      ...theme.typography.body3,
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.grey['500'],
      '&.hovered': {
        color: theme.palette.tertiary.dark
      },
      '&.selected': {
        color: theme.palette.tertiary.dark
      }
    }
  }),
  { name: 'Email-cell' }
)

const EmailCell = ({ contact }: Props) => {
  const classes = useStyles()

  let emailAddress
  let emailAddressLabel

  contact.attributes?.filter(attr => {
    if (!attr.is_partner && attr.attribute_type === 'email') {
      emailAddress = attr.text
      emailAddressLabel = attr.is_primary
        ? 'Main'
        : (emailAddressLabel = attr.label)

      return true
    }

    return false
  })

  const renderCellContent = ({
    isHovered = false,
    isSelected = false
  }: CellProps) => (
    <>
      {emailAddress && (
        <div
          className={cn(classes.attributeText, {
            hovered: isHovered,
            selected: isSelected
          })}
        >
          {emailAddress}
        </div>
      )}

      {emailAddressLabel && (
        <div
          className={cn(classes.attributeLabel, {
            hovered: isHovered,
            selected: isSelected
          })}
        >
          {emailAddressLabel}
        </div>
      )}
    </>
  )

  return <CellContainer renderCellContent={renderCellContent} />
}

export default EmailCell
