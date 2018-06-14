import React from 'react'
import ScrollDetector from 'react-scroll-detector'

import Grid from '../../../../../views/components/Grid/Table'
import { GridContainer } from './styled'
import EmptyState from './EmptyState'
import Fetching from './Fetching'

const Table = ({
  columns,
  data,
  isFetching,
  loadingPosition,
  positions,
  onScrollTop,
  onScrollBottom,
  onRef
}) => (
  <ScrollDetector
    onScrollTop={onScrollTop}
    onScrollBottom={onScrollBottom}
    accuracy={30}
    debounceTime={50}
  >
    <GridContainer>
      <Fetching
        show={
          isFetching && loadingPosition === positions.Top && data.length > 0
        }
        absolute={false}
      />

      <Fetching
        absolute
        show={isFetching && loadingPosition === positions.Middle}
      />

      <Grid
        columns={columns}
        data={data}
        emptyState={<EmptyState />}
        onRef={onRef}
        nested
      />

      <Fetching
        show={
          isFetching && loadingPosition === positions.Bottom && data.length > 0
        }
        absolute={false}
      />
    </GridContainer>
  </ScrollDetector>
)

export default Table
