import React, { Fragment } from 'react'
import _ from 'underscore'

import { SubHeader, Body } from '../../styled'
import BasicTable from '../Basic'

const NestedTable = ({ data, ...rest }) => (
  <Fragment>
    {_.map(data, (group, key) => (
      <TableGroup key={group.key || key} group={group} {...rest} />
    ))}
  </Fragment>
)

const TableGroup = ({ group, onGroupRef, ...rest }) => (
  <Body
    data-refid={group.refId}
    innerRef={ref => onGroupRef && onGroupRef(group.refId, ref)}
  >
    <BodyHeader
      header={group.header}
      style={group.headerStyle}
      className={group.headerClassName}
    />
    <BasicTable data={group.data} {...rest} />
  </Body>
)

const BodyHeader = ({ header, style, className }) => (
  <Fragment>
    {typeof header === 'string' ? (
      <SubHeader style={style} className={className}>
        {header}
      </SubHeader>
    ) : (
      header
    )}
  </Fragment>
)

export default NestedTable
