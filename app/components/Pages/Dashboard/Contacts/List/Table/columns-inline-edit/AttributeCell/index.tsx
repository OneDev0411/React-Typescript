import { makeStyles, Theme } from '@material-ui/core'

import { Attribute } from './components/Attribute'
import { useAttributeDef } from './hooks/use-attribute'

interface Props {
  contact: IContactWithAssoc<'contact.attributes'>
  attribute: string
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '450px'
    }
  }),
  {
    name: 'AttributeCell'
  }
)

export function AttributeCell({ contact, attribute }: Props) {
  const classes = useStyles()
  const { list, createAttribute, deleteAttribute } = useAttributeDef(
    contact,
    attribute
  )

  return (
    <div className={classes.container}>
      {list.map(attr => (
        <Attribute key={attr.id} attr={attr} onDelete={deleteAttribute} />
      ))}
      <Attribute onAdd={createAttribute} />
      <Attribute onAdd={createAttribute} />
    </div>
  )
}
