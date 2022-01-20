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
      letterSpacing: '0.15px',
      lineHeight: `${theme.spacing(3)}px`,
      color: theme.palette.grey['500']
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

  const renderCellContent = () => (
    <>
      {emailAddress && (
        <div className={classes.attributeText}>{emailAddress}</div>
      )}
      {emailAddressLabel && (
        <div className={classes.attributeLabel}>{emailAddressLabel}</div>
      )}
    </>
  )

  return <CellContainer renderCellContent={renderCellContent} />
}

export default EmailCell
