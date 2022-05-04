import { makeStyles, Theme } from '@material-ui/core'

import { Attribute } from './components/Attribute'

interface Props {
  contact: IContact
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

export function AttributeCell({ contact }: Props) {
  const classes = useStyles()

  console.log({ contact })

  return (
    <div className={classes.container}>
      <Attribute />
      <Attribute values={{ value: 'hamed', label: '33' }} />
    </div>
  )
}
