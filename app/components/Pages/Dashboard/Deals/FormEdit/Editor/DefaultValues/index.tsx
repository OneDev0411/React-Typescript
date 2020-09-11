import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  Theme,
  Box
} from '@material-ui/core'

import TreeView from 'components/TreeView'

import { useBrandTree } from './use-brand-tree'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      minHeight: '50vh'
    },
    node: {
      cursor: 'pointer'
    }
  }),
  {
    name: 'FormDefaultValuesDialog'
  }
)

export function DefaultValues() {
  const classes = useStyles()
  const { isLoading, getChildNodes } = useBrandTree()

  if (isLoading) {
    return null
  }

  return (
    <Dialog open fullWidth maxWidth="md" onClose={() => {}}>
      <DialogTitle>Default Values</DialogTitle>

      <DialogContent>
        <Box display="flex">
          <Box flex={4}>
            <TreeView
              selectable
              getChildNodes={getChildNodes}
              getNodeId={team => team.id}
              renderNode={team => (
                <div className={classes.node}>{team.name}</div>
              )}
            />
          </Box>

          <Box flex={6}>++</Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
