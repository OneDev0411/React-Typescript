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
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`
    },
    attributeLabel: {
      ...theme.typography.body3,
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.grey['500'],
      marginRight: theme.spacing(1.5),
      paddingLeft: theme.spacing(1)
    }
  }),
  { name: 'PhoneNumber-cell' }
)

const PhoneNumberCell = ({ contact, onSave }: Props) => {
  const classes = useStyles()
  let primaryPhoneNumber
  let otherPhoneNumber
  let phoneNumberLabel

  contact.attributes?.filter(attr => {
    if (attr.is_partner) {
      return false
    }

    if (attr.attribute_type === 'phone_number') {
      otherPhoneNumber = attr.text

      if (attr.is_primary) {
        phoneNumberLabel = 'Main'
        primaryPhoneNumber = otherPhoneNumber
      } else {
        phoneNumberLabel = attr.label
      }

      return true
    }

    return false
  })

  return (
    <CellContainer
      renderCellContent={() => (
        <>
          <div className={classes.attributeText}>
            {primaryPhoneNumber || otherPhoneNumber}
          </div>
          {phoneNumberLabel && (
            <div className={classes.attributeLabel}>{phoneNumberLabel}</div>
          )}
        </>
      )}
    />
  )
}

export default PhoneNumberCell
