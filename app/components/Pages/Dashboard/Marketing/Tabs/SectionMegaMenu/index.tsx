import React from 'react'

import { Grid } from '@material-ui/core'

import { Section } from 'components/PageSideNav/types'

import Item from './components/Item'

interface Props {
  data: Section
  mediums: string[]
}

export const SectionMegaMenu = ({ data, mediums }: Props) => {
  const { items } = data

  return (
    <Grid container spacing={2}>
      {items.map((item, i) => (
        <Grid key={i} item>
          <Item data={item} mediums={mediums} />
        </Grid>
      ))}
    </Grid>
  )
}

export default SectionMegaMenu
