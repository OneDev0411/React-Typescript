import React from 'react'

import { Grid } from '@material-ui/core'

import { Section } from 'components/PageSideNav/types'

import Item from './components/Item'

interface Props {
  data: Section
  mediums: { [key: string]: string[] }
  onClose: () => void
}

export const SectionMegaMenu = ({ data, mediums, onClose }: Props) => {
  const { items } = data

  const sanitizeMediums = item => {
    if (!Object.keys(mediums).length || !item.value || !item.title) {
      return null
    }

    const mediumKey = Array.isArray(item.value) ? item.title : item.value

    if (mediums[mediumKey]) {
      return mediums[mediumKey]
    }

    return []
  }

  return (
    <Grid container spacing={2}>
      {items.map((item, i) => {
        const currentSectionMediums = sanitizeMediums(item)

        return (
          <Grid key={i} item>
            <Item
              data={item}
              mediums={currentSectionMediums}
              onClose={onClose}
            />
          </Grid>
        )
      })}
    </Grid>
  )
}

export default SectionMegaMenu
