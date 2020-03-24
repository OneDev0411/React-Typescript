import React from 'react'

import { makeStyles, createStyles, Theme } from '@material-ui/core'
import { Link } from 'react-router'

import { SectionItem } from 'components/PageSideNav/types'

interface Props {
  data: SectionItem
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      minWidth: 200,
      '& a': {
        color: theme.palette.tertiary.dark,
        '&:hover': {
          textDecoration: 'none'
        }
      }
    },
    title: {
      ...theme.typography.subtitle2
    },
    items: {
      listStyle: 'none',
      padding: 0,
      marginTop: theme.spacing(1.5),
      ...theme.typography.body2,
      '& li': {
        '&:not(:last-child)': {
          marginBottom: theme.spacing(1)
        }
      }
    }
  })
)

function Item({ data }: Props) {
  const classes = useStyles()
  const { title, link } = data

  return (
    <div className={classes.container}>
      <Link to={link} className={classes.title}>
        {title}
      </Link>
      <ul className={classes.items}>
        <li>
          <Link to={link}>Hamed</Link>
        </li>
        <li>
          <Link to={link}>Ali</Link>
        </li>
      </ul>
    </div>
  )
}

export default Item
