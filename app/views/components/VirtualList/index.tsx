import React, { useState } from 'react'

import debounce from 'lodash/debounce'
import useDebouncedCallback from 'use-debounce/lib/callback'

import {
  VariableSizeList as List,
  ListOnItemsRenderedProps,
  ScrollDirection,
  ListOnScrollProps,
  VariableSizeListProps
} from 'react-window'

import Spinner from 'components/Spinner'

import { Container, Loading } from './styled'

export enum LoadingPosition {
  Top = 1,
  Middle = 2,
  Bottom = 3
}

export interface IProps extends VariableSizeListProps {
  threshold?: number
  isLoading?: boolean
  loadingPosition?: LoadingPosition
  onReachStart?(arg0: ListOnItemsRenderedProps): void
  onReachEnd?(arg0: ListOnItemsRenderedProps): void
  onVisibleRowChange?(data: ListOnItemsRenderedProps): void
  children: any
}

const VirtualList: React.FC<IProps> = ({
  children,
  threshold = 5,
  loadingPosition = LoadingPosition.Middle,
  isLoading = false,
  onReachEnd = () => null,
  onReachStart = () => null,
  onVisibleRowChange = () => null,
  ...props
}: IProps) => {
  const [scroll, setScroll] = useState<ListOnScrollProps | null>(null)

  const [deboundedOnReachStart] = useDebouncedCallback(onReachStart, 200)
  const [debouncedOnReachEnd] = useDebouncedCallback(onReachEnd, 200)

  /**
   * triggers when react-window renders new data in the scope
   * @param data
   */
  const onItemsRendered = (data: ListOnItemsRenderedProps): void => {
    onVisibleRowChange!(data)

    if (!scroll) {
      return
    }

    if (
      deboundedOnReachStart &&
      isReachedStart(data, scroll.scrollDirection, threshold)
    ) {
      deboundedOnReachStart(data)
    }

    if (
      debouncedOnReachEnd &&
      isReachedEnd(data, scroll.scrollDirection, props.itemCount, threshold)
    ) {
      debouncedOnReachEnd(data)
    }
  }

  return (
    <Container>
      {isLoading && (
        <Loading loadingPosition={loadingPosition}>
          <Spinner />
        </Loading>
      )}

      <List
        {...props}
        onItemsRendered={debounce(onItemsRendered, 100)}
        onScroll={setScroll}
      >
        {listProps => children(listProps)}
      </List>
    </Container>
  )
}

/**
 * checks whether scroll is reached end of list or not
 * @param data
 * @param scrollDirection
 * @param rowsCount
 */
function isReachedEnd(
  data: ListOnItemsRenderedProps | null,
  scrollDirection: ScrollDirection | null,
  itemCount: number,
  threshold: number
): boolean {
  if (!data) {
    return false
  }

  return (
    itemCount - data.visibleStopIndex < threshold &&
    scrollDirection === 'forward'
  )
}

/**
 * checks whether scroll is reached start of list or not
 * @param data
 * @param scrollDirection
 */
function isReachedStart(
  data: ListOnItemsRenderedProps | null,
  scrollDirection: ScrollDirection | null,
  threshold: number
): boolean {
  if (!data) {
    return false
  }

  return data.visibleStartIndex < threshold && scrollDirection === 'backward'
}

export default VirtualList
