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
  const s = useAttributeDef(contact, attribute)

  console.log({ contact, s })

  return (
    <div className={classes.container}>
      <Attribute />
      <Attribute values={{ value: 'hamed', label: '33' }} />
    </div>
  )
}
