import { Grid, makeStyles, Theme } from '@material-ui/core'

import { compare } from '@app/utils/helpers'
import { Section, SectionItem } from 'components/PageSideNav/types'

import Item from './components/Item'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      [theme.breakpoints.down('md')]: {
        justifyContent: 'space-between'
      }
    }
  }),
  { name: 'SectionMegaMenu' }
)

interface Props {
  data: Section
  categories: IMarketingTemplateCategories
  onClose: () => void
}

export const SectionMegaMenu = ({ data, categories, onClose }: Props) => {
  const classes = useStyles()
  const { items } = data

  const sanitizeMediums = (item: SectionItem) => {
    const mediumKey = Array.isArray(item.value) ? item.title : item.value

    if (mediumKey && categories[mediumKey]) {
      return categories[mediumKey]
    }

    return []
  }

  const sortItemsByTitleAlphabetically = (a: SectionItem, b: SectionItem) => {
    return compare(a.title.toLowerCase(), b.title.toLowerCase())
  }

  return (
    <Grid container spacing={2} className={classes.container}>
      {items.sort(sortItemsByTitleAlphabetically).map((item, i) => {
        const currentSectionMediums = sanitizeMediums(item)

        return (
          <Item
            key={i}
            data={item}
            mediums={currentSectionMediums}
            onClose={onClose}
          />
        )
      })}
    </Grid>
  )
}

export default SectionMegaMenu
