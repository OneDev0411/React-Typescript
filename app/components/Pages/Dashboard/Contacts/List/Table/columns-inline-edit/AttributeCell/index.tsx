import { Typography, makeStyles, Theme } from '@material-ui/core'

import { Attribute } from './components/Attribute'
import { useAttributeCell } from './hooks/use-attribute-cell'

interface Props {
  contact: IContactWithAssoc<'contact.attributes'>
  attributeName: string
  addLabel?: string
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '450px'
    },
    addButton: {
      padding: theme.spacing(1.5, 2),
      color: theme.palette.primary.main,
      cursor: 'pointer'
    }
  }),
  {
    name: 'AttributeCell'
  }
)

export function AttributeCell({
  contact,
  attributeName,
  addLabel = 'Add New Value'
}: Props) {
  const classes = useStyles()
  const {
    list,
    attributeDef,
    isAppending,
    prependNewValue,
    appendNewValue,
    create,
    update,
    remove
  } = useAttributeCell(contact, attributeName)

  if (!attributeDef) {
    return <span>Attribute is not valid</span>
  }

  return (
    <div className={classes.container}>
      {list.map(attr => (
        <Attribute
          key={attr.id}
          attribute={attr}
          attributeDef={attributeDef}
          onUpdate={update}
          onDelete={remove}
        />
      ))}
      {isAppending ? (
        <Attribute
          isNew
          attributeDef={attributeDef}
          onAdd={create}
          onDiscard={prependNewValue}
        />
      ) : (
        <div className={classes.addButton} onClick={appendNewValue}>
          <Typography variant="body2">{addLabel}</Typography>
        </div>
      )}
    </div>
  )
}
