import { makeStyles } from '@material-ui/core'

import CellContainer from '@app/views/components/Grid/Table/features/cells/CellContainer'

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
      lineHeight: `${theme.spacing(3)}px`
    },
    attributeLabel: {
      ...theme.typography.body3,
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.grey['500']
    }
  }),
  { name: 'PhoneNumber-cell' }
)

const PhoneNumberCell = ({ contact, onSave }: Props) => {
  const classes = useStyles()

  let phoneNumber
  let phoneNumberLabel

  contact.attributes?.filter(attr => {
    if (!attr.is_partner && attr.attribute_type === 'phone_number') {
      phoneNumber = attr.text
      phoneNumberLabel = attr.is_primary
        ? 'Main'
        : (phoneNumberLabel = attr.label)

      return true
    }

    return false
  })

  const renderCellContent = () => (
    <>
      {phoneNumber && (
        <div className={classes.attributeText}>{phoneNumber}</div>
      )}
      {phoneNumberLabel && (
        <div className={classes.attributeLabel}>{phoneNumberLabel}</div>
      )}
    </>
  )

  return <CellContainer renderCellContent={renderCellContent} />
}

export default PhoneNumberCell
