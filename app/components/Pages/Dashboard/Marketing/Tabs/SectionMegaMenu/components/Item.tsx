import React from 'react'
import { withRouter, WithRouterProps } from 'react-router'

import { makeStyles, createStyles, Theme } from '@material-ui/core'

import { SectionItem } from 'components/PageSideNav/types'

import { MEDIUMS_COLLECTION } from '../../../constants'

interface Props {
  data: SectionItem
  mediums: string[]
  onClose: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      minWidth: 200,
      color: theme.palette.tertiary.dark
    },
    title: {
      ...theme.typography.subtitle2,
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

function Item({ data, mediums, router, onClose }: Props & WithRouterProps) {
  const classes = useStyles()
  const { title, link } = data

  const navigateTo = (e, link) => {
    e.preventDefault()

    if (!link) {
      return null
    }

    onClose()
    router.push(link)
  }

  return (
    <div className={classes.container}>
      <span className={classes.title} onClick={e => navigateTo(e, link)}>
        {title}
      </span>
      <ul className={classes.items}>
        {mediums.map(medium => {
          const url = `${link}/${medium}`

          return (
            <li key={medium} onClick={e => navigateTo(e, url)}>
              {MEDIUMS_COLLECTION[medium] || medium}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default withRouter(Item)
