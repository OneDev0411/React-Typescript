import { MouseEvent } from 'react'

import { Grid, makeStyles, createStyles, Theme } from '@material-ui/core'

import { useNavigate } from '@app/hooks/use-navigate'
import { getTemplateMediumLabel } from 'utils/marketing-center/get-template-medium-label'

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
  link: string
  title: string
  mediums: IMarketingTemplateMedium[]
  onClose: () => void
}

function Item({ title, link, mediums, onClose }: Props) {
  const classes = useStyles()
  const navigate = useNavigate()

  const navigateTo = (e: MouseEvent, link: string) => {
    e.preventDefault()

    if (!link) {
      return null
    }

    onClose()

    navigate(link)
  }

  const renderMediumsList = () => {
    return (
      <ul className={classes.items}>
        {mediums.map(medium => {
          const url = `${link}/${medium}`

          return (
            <li key={medium} onClick={e => navigateTo(e, url)}>
              {getTemplateMediumLabel(medium)}
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
