import React, { Fragment } from 'react'
import _ from 'underscore'

import { Body } from '../../styled'
import BasicTable from '../Basic'

const MultipleTable = ({ data, ...rest }) => (
  <Fragment>
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
    <BasicTable data={group.data} {...rest} />
  </Body>
)

export default MultipleTable
