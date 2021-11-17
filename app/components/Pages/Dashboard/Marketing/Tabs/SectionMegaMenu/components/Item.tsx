import { Grid, makeStyles, createStyles, Theme } from '@material-ui/core'

import { goTo } from '@app/utils/go-to'
import { getTemplateMediumLabel } from '@app/utils/marketing-center/get-template-medium-label'
import { SectionItem } from '@app/views/components/PageSideNav/types'
import { ShowMoreLess } from '@app/views/components/ShowMoreLess'

import { ALL_MEDIUMS } from '../../../Wizard/constants'

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
  // mediums: IMarketingTemplateMedium[]
  onClose: () => void
}

function Item({ data, onClose }: Props) {
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
        <ShowMoreLess count={2}>
          {ALL_MEDIUMS.map(medium => {
            const url = `${link}/${medium}`

            return (
              <li key={medium} onClick={e => navigateTo(e, url)}>
                {getTemplateMediumLabel(medium)}
              </li>
            )
          })}
        </ShowMoreLess>
      </ul>
    )
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
