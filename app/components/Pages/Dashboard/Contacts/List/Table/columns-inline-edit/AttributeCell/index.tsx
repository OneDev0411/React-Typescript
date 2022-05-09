import { makeStyles, Theme } from '@material-ui/core'

import { Attribute } from './components/Attribute'
import { useAttributeDef } from './hooks/use-attribute'

interface Props {
  contact: IContactWithAssoc<'contact.attributes'>
  attributeName: string
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

export function AttributeCell({ contact, attributeName }: Props) {
  const classes = useStyles()
  const { list, attributeDef, create, update, remove } = useAttributeDef(
    contact,
    attributeName
  )

  console.log({ contact, list, attributeDef })

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
      <Attribute attributeDef={attributeDef} onAdd={create} />
      <Attribute attributeDef={attributeDef} onAdd={create} />
    </div>
  )
}
