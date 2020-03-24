import React from 'react'

import { Grid } from '@material-ui/core'

import { Section } from 'components/PageSideNav/types'

import MegaMenu from '../components/MegaMenu'
import Item from './components/Item'

interface Props {
  data: Section
}

export const LifeTab = ({ data }: Props) => {
  const { title, items } = data

  return (
    <MegaMenu title={title}>
      <Grid container spacing={2}>
        {items.map((item, i) => (
          <Grid key={i} item>
            <Item data={item} />
          </Grid>
        ))}
      </Grid>
    </MegaMenu>
  )
}

export default LifeTab
