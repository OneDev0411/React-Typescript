import React, {
  ReactNode,
  useState,
  Ref,
  useImperativeHandle,
  useRef
} from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import { Theme, Grid, Box, Button } from '@material-ui/core'
import { addNotification } from 'reapop'

import Loading from 'partials/Loading'

import NoContentMessage from '../NoContentMessage'

const useStyles = makeStyles((theme: Theme) => ({
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
}))

type Id = string | number
interface ItemBase {
  id: Id
}

export interface InfiniteScrollListHandles<T extends ItemBase> {
  updateItem: (id: Id, errorMessage?: string) => Promise<void>
}

interface Props<T extends ItemBase> {
  fetchMoreItems: (from: number, count: number) => Promise<ReadonlyArray<T>>
  fetchItem: (id: Id) => Promise<T>
  renderItem: (item: T, index: number, items: ReadonlyArray<T>) => ReactNode
  innerRef: Ref<InfiniteScrollListHandles<T>>
  emptyListMessage?: string
  fetchErrorMessage?: string
}

export default function InfiniteScrollList<T extends ItemBase>({
  fetchMoreItems,
  fetchItem,
  renderItem,
  innerRef,
  emptyListMessage = 'No Items',
  fetchErrorMessage = 'Something went wrong while fetching more items. Please try again.'
}: Props<T>) {
  const [status, setStatus] = useState<
    'fetched' | 'fetching' | 'error' | 'finished'
  >('fetched')
  const [items, setItems] = useState<ReadonlyArray<T>>([])

  const dispatch = useDispatch()

  useImperativeHandle(innerRef, () => ({
    updateItem: async (
      id: Id,
      errorMessage: string = 'Something went wrong while updating the item in the list.'
    ): Promise<void> => {
      const index = items.findIndex(item => item.id === id)

      if (index < 0) {
        return
      }

      try {
        const newItem = await fetchItem(id)

        setItems([...items.slice(0, index), newItem, ...items.slice(index + 1)])
      } catch (reason) {
        console.error(reason)
        dispatch(
          addNotification({
            status: 'error',
            message: errorMessage
          })
        )
      }
    }
  }))

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
        {renderList()}
      </Grid>
    </div>
  )

  function renderList() {
    if (items.length === 0 && status === 'finished') {
      return <NoContentMessage>{emptyListMessage}</NoContentMessage>
    }

    return (
      <>
        {items.map((item, index, items) => (
          <Grid key={item.id} item classes={{ root: classes.itemWrapper }}>
            {renderItem(item, index, items)}
          </Grid>
        ))}
        <Grid item xs classes={{ root: classes.status }}>
          {renderFooter()}
        </Grid>
      </>
    )

    function renderFooter() {
      if (status === 'fetching' || status === 'fetched') {
        return <Loading />
      }

      if (status === 'error') {
        return (
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
        )
      }

      return null
    }
  }
}
