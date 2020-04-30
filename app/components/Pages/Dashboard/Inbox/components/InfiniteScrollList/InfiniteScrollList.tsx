import React, { ReactNode, useState, useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Theme, Grid, Box, Button, Divider } from '@material-ui/core'
import classNames from 'classnames'

import NoContentMessage from '../NoContentMessage'

const useStyles = makeStyles(
  (theme: Theme) => ({
    listWrapper: {
      height: '100%',
      overflowX: 'hidden',
      overflowY: 'scroll'
    },
    list: {
      width: '100%',
      minHeight: '100%'
    },
    itemWrapper: {
      width: '100%'
    },
    itemWrapperSelectable: {
      cursor: 'pointer'
    },
    itemDivider: {
      marginLeft: theme.spacing(5)
    }
  }),
  { name: 'InfiniteScrollList' }
)

interface Props<Item> {
  items: ReadonlyArray<Item>
  onNeedMoreItems: () => Promise<boolean>
  selectedItem?: Item
  onSelectItem?: (item: Item | undefined) => void
  emptyListMessage?: string
  itemKey: (item: Item, index: number) => string | number
  renderItem: (item: Item, selected: boolean) => ReactNode
}

export default function InfiniteScrollList<Item>({
  items,
  onNeedMoreItems,
  selectedItem,
  onSelectItem,
  emptyListMessage = 'No Items',
  itemKey,
  renderItem
}: Props<Item>) {
  const [status, setStatus] = useState<
    'fetched' | 'fetching' | 'error' | 'finished'
  >('fetched')

  useEffect(() => {
    setStatus(status =>
      status === 'error' || status === 'finished' ? 'fetched' : status
    )
  }, [items])

  const listWrapperRef = useRef<HTMLDivElement>(null)

  function checkListReachedEnd(): boolean {
    const listWrapperElement = listWrapperRef.current

    if (!listWrapperElement || items.length === 0) {
      return true
    }

    return (
      listWrapperElement.scrollTop + listWrapperElement.offsetHeight >=
      listWrapperElement.scrollHeight -
        Math.max(listWrapperElement.offsetHeight / 2, 1000)
    )
  }
  function fetchMoreItemsManaged(forced?: boolean): void {
    setStatus(status => {
      if (status !== 'fetched' && !forced) {
        return status // Bypass this fetch.
      }

      onNeedMoreItems().then(
        finished => setStatus(finished ? 'finished' : 'fetched'),
        () => setStatus('error')
      )

      return 'fetching'
    })
  }
  function fetchMoreItemsManagedIfRequired(): void {
    if (checkListReachedEnd() && status === 'fetched') {
      fetchMoreItemsManaged()
    }
  }

  fetchMoreItemsManagedIfRequired()

  const classes = useStyles()

  return (
    <div
      className={classes.listWrapper}
      ref={listWrapperRef}
      onScroll={fetchMoreItemsManagedIfRequired}
    >
      <Grid container spacing={0} direction="column" className={classes.list}>
        {items.length === 0 && status === 'finished' ? (
          <NoContentMessage>{emptyListMessage}</NoContentMessage>
        ) : (
          <>
            {items.map((item, index) => (
              <Grid
                key={itemKey(item, index)}
                item
                onClick={() => onSelectItem && onSelectItem(item)}
                className={classNames(
                  classes.itemWrapper,
                  onSelectItem && classes.itemWrapperSelectable
                )}
              >
                {renderItem(item, item === selectedItem)}
                <Divider className={classes.itemDivider} />
              </Grid>
            ))}
            <Grid item xs>
              {status === 'fetching' || status === 'fetched' ? null : status ===
                'error' ? (
                <Box padding={4}>
                  <Button
                    variant="text"
                    color="primary"
                    fullWidth
                    onClick={() => fetchMoreItemsManaged(true)}
                  >
                    Retry
                  </Button>
                </Box>
              ) : null}
            </Grid>
          </>
        )}
      </Grid>
    </div>
  )
}
