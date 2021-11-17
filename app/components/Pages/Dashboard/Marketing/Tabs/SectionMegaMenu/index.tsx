import { Grid } from '@material-ui/core'

import { Section } from '@app/views/components/PageSideNav/types'

import Item from './components/Item'

interface Props {
  data: Section
  onClose: () => void
}

export const SectionMegaMenu = ({ data, onClose }: Props) => {
  const { items } = data

  return (
    <Grid container spacing={2}>
      {items.map((item, i) => {
        return <Item key={i} data={item} onClose={onClose} />
      })}
    </Grid>
  )
}

export default SectionMegaMenu
