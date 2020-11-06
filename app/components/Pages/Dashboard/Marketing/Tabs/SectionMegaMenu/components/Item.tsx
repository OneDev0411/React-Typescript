import React from 'react'
import { Grid, makeStyles, createStyles, Theme } from '@material-ui/core'

import { goTo } from 'utils/go-to'

import { SectionItem } from 'components/PageSideNav/types'

import { MEDIUM_LABEL_MAP } from '../../../constants'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      minWidth: 200,
      color: theme.palette.tertiary.dark
    },
    title: {
      ...theme.typography.subtitle1,
      cursor: 'pointer',
      '&:hover': {
        color: theme.palette.primary.main
      }
    },
    items: {
      listStyle: 'none',
      padding: 0,
      marginTop: theme.spacing(1.5),
      ...theme.typography.body2,
      '& li': {
        cursor: 'pointer',
        '&:hover': {
          color: theme.palette.primary.main
        },
        '&:not(:last-child)': {
          marginBottom: theme.spacing(1)
        }
      }
    }
  })
)

interface Props {
  data: SectionItem
  mediums: MarketingTemplateMedium[]
  onClose: () => void
}

function Item({ data, mediums, onClose }: Props) {
  const classes = useStyles()
  const { title, link } = data

  const navigateTo = (e, link) => {
    e.preventDefault()

    if (!link) {
      return null
    }

    onClose()

    goTo(link)
  }

  const renderMediumsList = () => {
    return (
      <ul className={classes.items}>
        {mediums.map(medium => {
          const url = `${link}/${medium}`

          return (
            <li key={medium} onClick={e => navigateTo(e, url)}>
              {MEDIUM_LABEL_MAP[medium] || medium}
            </li>
          )
        })}
      </ul>
    )
  }

  // Do not render categories without any mediums/templates
  if (mediums.length === 0) {
    return null
  }

  return (
    <Grid item>
      <div className={classes.container}>
        <span className={classes.title} onClick={e => navigateTo(e, link)}>
          {title}
        </span>
        {renderMediumsList()}
      </div>
    </Grid>
  )
}

export default Item
