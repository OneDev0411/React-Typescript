import { Typography, makeStyles, Theme } from '@material-ui/core'

import { Attribute, Props as AttributeProps } from './components/Attribute'
import { useAttributeCell } from './hooks/use-attribute-cell'

interface Props extends Pick<AttributeProps, 'validateRules'> {
  contact: IContact
  attributeName: string
  addLabel?: string
  actions?: AttributeProps['actions']
  callback?: () => void
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

export function InlineEditAttributeCell({
  contact,
  actions,
  callback,
  attributeName,
  validateRules,
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
  } = useAttributeCell(contact, attributeName, callback)

  if (!attributeDef) {
    return <span>Attribute is not valid</span>
  }

  return (
    <div className={classes.container}>
      {list.map(attr => (
        <Attribute
          key={attr.id}
          attribute={attr}
          actions={actions}
          attributeDef={attributeDef}
          validateRules={validateRules}
          onUpdate={update}
          onDelete={remove}
        />
      ))}
      {isAppending || list.length === 0 ? (
        <Attribute
          attributeDef={attributeDef}
          validateRules={validateRules}
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
