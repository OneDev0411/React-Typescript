import React from 'react'
import cn from 'classnames'

class TrComponent extends React.PureComponent {
  render() {
    const { children, className, ...rest } = this.props

    return (
      <div className={cn('rt-td', className)} role="gridcell" {...rest}>
        {children}
      </div>
    )
  }
}

export default TrComponent
