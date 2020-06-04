import React from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'

import { createStyles, makeStyles, Theme } from '@material-ui/core'

import ContextItem from './item'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      '&:not(:last-child)': {
        marginBottom: theme.spacing(4)
      }
    },
    root: {
      padding: theme.spacing(1.5, 2),
      background: '#EAEAEA',
      borderRadius: theme.shape.borderRadius
    },
    tright: { textAlign: 'right' },
    tleft: { textAlign: 'left' },
    list: {
      paddingTop: theme.spacing(0.5),
      '& li': {
        borderRadius: theme.shape.borderRadius,
        cursor: 'pointer',
        '& .MuiIconButton-root': {
          display: 'none'
        },
        '&:nth-child(even)': {
          background: '#FAFAFA'
        },
        '&:hover': {
          background: theme.palette.grey[50],
          color: theme.palette.primary.main,
          '& .MuiIconButton-root': {
            display: 'block'
          }
        }
      }
    }
  })
)

interface Props {
  title: string | null
  items: Array<IDealBrandContext>
  onSetIsModalOpen: () => void
  onSetSelectedContext: (context: IDealBrandContext) => void
  onDelete: (contextId: UUID) => void
}

function CategoryItem({
  title,
  items,
  onSetIsModalOpen,
  onSetSelectedContext,
  onDelete
}: Props) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Box className={classes.root}>
        <Grid container justify="space-between" alignItems="center">
          <Grid item xs={12} sm={6} className={classes.tleft}>
            <Box fontWeight="fontWeightBold">
              {title !== 'null' ? title : 'Unorganized'}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.tright}>
            <Button
              variant="outlined"
              size="small"
              onClick={e => onSetIsModalOpen()}
            >
              <Box fontWeight="fontWeightBold">Add New Context</Box>
            </Button>
          </Grid>
        </Grid>
      </Box>
      <List disablePadding className={classes.list}>
        {items.map(c => (
          <ContextItem
            key={c.id}
            name={c.label}
            context={c}
            onSelect={() => {
              onSetIsModalOpen()
              onSetSelectedContext(c)
            }}
            onDelete={() => onDelete(c.id)}
          />
        ))}
      </List>
    </div>
  )
}

export default CategoryItem
