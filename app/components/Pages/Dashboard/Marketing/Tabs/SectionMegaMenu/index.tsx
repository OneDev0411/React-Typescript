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

  const sanitizeMediums = (item: SectionItem): IMarketingTemplateMedium[] => {
    const mediumKey = Array.isArray(item.value) ? item.title : item.value

    if (mediumKey && categories[mediumKey]) {
      return categories[mediumKey]?.mediums || []
    }

    return []
  }

  const sortItemsByTitleAlphabetically = (a: SectionItem, b: SectionItem) => {
    if (a.value && b.value) {
      return compare(
        categories[a.value]?.label.toLowerCase(),
        categories[b.value]?.label.toLowerCase()
      )
    }

    return compare(a.title.toLowerCase(), b.title.toLowerCase())
  }

  return (
    <Grid container spacing={2} className={classes.container}>
      {items.sort(sortItemsByTitleAlphabetically).map((item, i) => {
        const currentSectionMediums = sanitizeMediums(item)

        const category = item.value && categories[item.value]
        const title = category ? category.label : item.title

        return (
          <Item
            key={i}
            link={item.link}
            title={title}
            mediums={currentSectionMediums}
            onClose={onClose}
          />
        )
      })}
    </Grid>
  )
}

export default SectionMegaMenu
