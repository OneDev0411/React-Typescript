import { Box, makeStyles, Theme, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { mdiChevronRight, mdiFolderOutline } from '@mdi/js'
import cn from 'classnames'

import { muiIconSizes, SvgIcon } from '../../SvgIcons'
import { useDocumentRepositoryContext } from '../context/use-document-repository-context'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      padding: theme.spacing(1, 1, 1, 3),
      color: theme.palette.tertiary.main,
      cursor: 'pointer',
      '&.active': {
        color: theme.palette.secondary.main,
        backgroundColor: theme.palette.info.ultralight
      },
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    },
    folderIcon: {
      color: theme.palette.tertiary.main,
      '&.active': {
        color: theme.palette.secondary.main
      }
    },
    chevronIcon: {
      visibility: 'hidden',
      '&.active': {
        color: theme.palette.secondary.main,
        visibility: 'visible'
      }
    }
  }),
  {
    name: 'DocumentRepositoryCategoriesSidebar'
  }
)

interface Props {
  isFetching: boolean
  onChangeActiveCategory: (index: number) => void
}

export function CategoriesSidebar({
  isFetching,
  onChangeActiveCategory
}: Props) {
  const classes = useStyles()
  const { activeCategoryIndex, categoryNames } = useDocumentRepositoryContext()

  if (isFetching) {
    return (
      <Box px={3}>
        {[...Array(5).keys()].map((_, index) => (
          <Box key={index} mb={1}>
            <Skeleton variant="rect" width="100%" height="20px" />
          </Box>
        ))}
      </Box>
    )
  }

  return (
    <Box pt={2}>
      {categoryNames.map((categoryName, index) => (
        <Box
          key={index}
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={cn(classes.root, {
            active: activeCategoryIndex === index
          })}
          onClick={() => onChangeActiveCategory(index)}
        >
          <Box display="flex" alignItems="center">
            <SvgIcon
              className={cn(classes.folderIcon, {
                active: activeCategoryIndex === index
              })}
              path={mdiFolderOutline}
              size={muiIconSizes.medium}
              rightMargined
            />
            <Typography variant="subtitle1">
              {categoryName || 'Untitled'}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <SvgIcon
              className={cn(classes.chevronIcon, {
                active: activeCategoryIndex === index
              })}
              path={mdiChevronRight}
              size={muiIconSizes.medium}
              rightMargined
            />
          </Box>
        </Box>
      ))}
    </Box>
  )
}
