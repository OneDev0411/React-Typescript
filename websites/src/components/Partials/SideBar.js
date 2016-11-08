import React, { Component } from 'react'
import S from 'shorti'
class SideBar extends Component {
  render() {
    const main_style = S('absolute w-400 h-100p r-0 t-0 bg-263445')
    return (
      <div style={ main_style }>
        Side bar
      </div>
    )
  }
}

export default SideBar
