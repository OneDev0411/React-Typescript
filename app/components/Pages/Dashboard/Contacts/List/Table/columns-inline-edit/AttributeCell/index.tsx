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
  const { list } = useAttributeDef(contact, attribute)

  console.log({ contact, list })

  return (
    <div className={classes.container}>
      {list.map(attr => (
        <Attribute key={attr.id} attr={attr} />
      ))}
    </div>
  )
}
