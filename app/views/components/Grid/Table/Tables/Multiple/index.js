import React, { Fragment } from 'react'
import _ from 'underscore'

import { Body } from '../../styled'
import BasicTable from '../Basic'

import TableHeader from '../../Header'

const MultipleTable = ({ data, ...rest }) => (
  <Fragment>
    <TableHeader
      columns={rest.columns}
      sizes={rest.sizes}
      getHeaderProps={rest.getHeaderProps}
      getHeaderRowProps={rest.getHeaderRowProps}
    />

    {_.map(data, (group, key) => (
      <TableGroup key={group.key || key} group={group} {...rest} />
    ))}
  </Fragment>
)

const TableGroup = ({ group, onTableRef, SubComponent, ...rest }) => (
  <Body
    data-refid={group.refId}
    innerRef={ref => onTableRef && onTableRef(group.refId, ref)}
  >
    {SubComponent && <SubComponent {...group} {...rest} />}
    <BasicTable data={group.data} {...rest} showTableHeader={false} />
  </Body>
)

export default MultipleTable
