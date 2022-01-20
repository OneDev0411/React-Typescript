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
      color: theme.palette.grey['500'],
      marginRight: theme.spacing(1.5),
      paddingLeft: theme.spacing(1)
    }
  }),
  { name: 'Email-cell' }
)

const EmailCell = ({ contact }: Props) => {
  const classes = useStyles()

  let primaryEmail
  let otherEmail
  let emailLabel

  contact.attributes?.filter(attr => {
    if (attr.is_partner) {
      return false
    }

    if (attr.attribute_type === 'email') {
      otherEmail = attr.text

      if (attr.is_primary) {
        emailLabel = 'Main'
        primaryEmail = otherEmail
      } else {
        emailLabel = attr.label
      }

      return true
    }

    return false
  })

  const renderCellContent = () => (
    <>
      <div className={classes.attributeText}>{primaryEmail || otherEmail}</div>
      {emailLabel && <div className={classes.attributeLabel}>{emailLabel}</div>}
    </>
  )

  return <CellContainer renderCellContent={renderCellContent} />
}

export default EmailCell
