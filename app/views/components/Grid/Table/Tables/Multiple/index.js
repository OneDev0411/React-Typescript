import React, { Fragment } from 'react'
import _ from 'underscore'

import BasicTable from '../Basic'

import TableHeader from '../../Header'

const MultipleTable = ({ data, LoadingState, isFetching, ...rest }) => (
  <Fragment>
    <TableHeader
      columns={rest.columns}
      sizes={rest.sizes}
      getHeaderProps={rest.getHeaderProps}
      getHeaderRowProps={rest.getHeaderRowProps}
    />

    {isFetching && LoadingState ? (
      <LoadingState />
    ) : (
      _.map(data, (group, key) => (
        <TableGroup
          key={group.key || key}
          group={group}
          isFetching={isFetching}
          {...rest}
        />
      ))
    )}
  </Fragment>
)

const TableGroup = ({ group, onTableRef, SubComponent, ...rest }) => (
  <div
    data-refid={group.refId}
    ref={ref => onTableRef && onTableRef(group.refId, ref)}
  >
    {SubComponent && <SubComponent {...group} {...rest} />}
    <BasicTable data={group.data} {...rest} showTableHeader={false} multiple />
  </div>
)

export default MultipleTable
