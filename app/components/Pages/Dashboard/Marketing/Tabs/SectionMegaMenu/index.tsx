import React from 'react'

import { Grid } from '@material-ui/core'

import { Section } from 'components/PageSideNav/types'

import Item from './components/Item'

interface Props {
  data: Section
  mediums: { [key: string]: string[] }
}

export const SectionMegaMenu = ({ data, mediums }: Props) => {
  const { items } = data
  const sanitizeMediums = item => {
    if (!Object.keys(mediums).length || !item.value || !item.title) {
      return []
    }

    const mediumKey = !Array.isArray(item.value) ? item.value : item.title

    if (mediums[mediumKey]) {
      return mediums[mediumKey]
    }

    return []
  }

  return (
    <Grid container spacing={2}>
      {items.map((item, i) => {
        return (
          <Grid key={i} item>
            <Item data={item} mediums={sanitizeMediums(item)} />
          </Grid>
        )
      })}
    </Grid>
  )
}

export default SectionMegaMenu
