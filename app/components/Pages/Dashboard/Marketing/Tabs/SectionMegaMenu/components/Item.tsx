import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core'

// import Loading from 'components/Partials/Loading'
import Loading from 'components/SvgIcons/BubblesSpinner/IconBubblesSpinner'

import { goTo } from 'utils/go-to'

import { SectionItem } from 'components/PageSideNav/types'

import { MEDIUMS_COLLECTION } from '../../../constants'

interface Props {
  data: SectionItem
  mediums: string[] | null
  onClose: () => void
}

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
    },
    noItems: {
      display: 'block',
      marginTop: theme.spacing(1),
      ...theme.typography.body2,
      color: theme.palette.grey[500]
    }
  })
)

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

  const renderContent = () => {
    if (!mediums) {
      return (
        <div>
          <Loading />
        </div>
      )
    }

    if (mediums.length === 0) {
      return <span className={classes.noItems}>No Items</span>
    }

    return (
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
    )
  }

  return (
    <div className={classes.container}>
      <span className={classes.title} onClick={e => navigateTo(e, link)}>
        {title}
      </span>
      {renderContent()}
    </div>
  )
}

export default Item
