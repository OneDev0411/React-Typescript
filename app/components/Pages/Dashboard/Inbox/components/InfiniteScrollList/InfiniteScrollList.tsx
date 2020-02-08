import React, { ReactNode, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import { Theme, Grid, Box, Button } from '@material-ui/core'
import { addNotification } from 'reapop'

import Loading from 'partials/Loading'

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
      minHeight: '100%',
      borderRight: '1px solid #d4d4d4'
    },
    status: {
      padding: theme.spacing(2)
    },
    itemWrapper: {
      width: '100%',
      cursor: 'pointer',
      borderBottom: '1px solid #d4d4d4'
    }
  }),
  { name: 'InfiniteScrollList' }
)

type Id = string | number
interface ItemBase {
  id: Id
}

interface Props<T extends ItemBase> {
  fetchMoreItems: (from: number, count: number) => Promise<ReadonlyArray<T>>
  fetchItem: (id: Id) => Promise<T>
  renderItem: (
    item: T,
    selected: boolean,
    index: number,
    items: ReadonlyArray<T>
  ) => ReactNode
  selectedItemId?: Id
  onSelectItem?: (item: T) => void
  emptyListMessage?: string
  fetchErrorMessage?: string
}

export default function InfiniteScrollList<T extends ItemBase>({
  fetchMoreItems,
  fetchItem,
  renderItem,
  selectedItemId,
  onSelectItem,
  emptyListMessage = 'No Items',
  fetchErrorMessage = 'Something went wrong while fetching more items. Please try again.'
}: Props<T>) {
  const [status, setStatus] = useState<
    'fetched' | 'fetching' | 'error' | 'finished'
  >('fetched')
  const [items, setItems] = useState<ReadonlyArray<T>>([])

  const dispatch = useDispatch()

  const listWrapperRef = useRef<HTMLDivElement>(null)

  function checkListReachedEnd(): boolean {
    const listWrapperElement = listWrapperRef.current

    if (!listWrapperElement) {
      return false
    }

    return (
      listWrapperElement.scrollTop + listWrapperElement.offsetHeight >=
      listWrapperElement.scrollHeight -
        Math.max(listWrapperElement.offsetHeight / 2, 200)
    )
  }
  function fetchMoreItemsManaged(forced?: boolean): void {
    const itemCountPerFetch = 50

    setStatus(status => {
      if (status !== 'fetched' && !forced) {
        return status // Bypass this fetch.
      }

      fetchMoreItems(items.length, itemCountPerFetch).then(
        newItems => {
          setItems(items.concat(newItems))
          setStatus(
            newItems.length < itemCountPerFetch ? 'finished' : 'fetched'
          )
          fetchMoreItemsManagedIfRequired()
        },
        reason => {
          console.error(reason)
          dispatch(
            addNotification({
              status: 'error',
              message: fetchErrorMessage
            })
          )
          setStatus('error')
        }
      )

      return 'fetching'
    })
  }
  function fetchMoreItemsManagedIfRequired(): void {
    setTimeout(() => {
      if (checkListReachedEnd() && status === 'fetched') {
        fetchMoreItemsManaged()
      }
    })
  }

  fetchMoreItemsManagedIfRequired()

  const classes = useStyles()

  return (
    <div
      className={classes.listWrapper}
      ref={listWrapperRef}
      onScroll={fetchMoreItemsManagedIfRequired}
    >
      <Grid
        container
        spacing={0}
        direction="column"
        classes={{ root: classes.list }}
      >
        {items.length === 0 && status === 'finished' ? (
          <NoContentMessage>{emptyListMessage}</NoContentMessage>
        ) : (
          <>
            {items.map((item, index, items) => (
              <Grid
                key={item.id}
                item
                onClick={() => onSelectItem && onSelectItem(item)}
                classes={{ root: classes.itemWrapper }}
              >
                {renderItem(item, item.id === selectedItemId, index, items)}
              </Grid>
            ))}
            <Grid item xs classes={{ root: classes.status }}>
              {status === 'fetching' || status === 'fetched' ? (
                <Loading />
              ) : status === 'error' ? (
                <Box paddingTop={2}>
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
