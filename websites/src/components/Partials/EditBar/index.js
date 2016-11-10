import React, { Component } from 'react'
import S from 'shorti'
import CoverPhoto from './Steps/CoverPhoto'
import Social from './Steps/Social'
import Text1 from './Steps/Text1'
import Text2 from './Steps/Text2'
import Text3 from './Steps/Text3'
import QuickHighlights from './Steps/QuickHighlights'
import Media from './Steps/Media'

class EditBar extends Component {
  getStep(step) {
    switch (step) {
      case 1:
        return <CoverPhoto {...this.props}/>
      case 2:
        return <Text1 {...this.props}/>
      case 3:
        return <Social {...this.props}/>
      case 4:
        return <QuickHighlights {...this.props}/>
      case 5:
        return <Media {...this.props}/>
      case 6:
        return <Text2 {...this.props}/>
      case 7:
        return <Text3 {...this.props}/>
      default:
        return
    }
  }
  render() {
    const data = this.props.data
    const main_style = S('fixed w-400 h-100p r-0 t-0 bg-263445 p-30 color-fff')
    return (
      <div style={ main_style }>
        { this.getStep(data.step) }
      </div>
    )
  }
}

export default EditBar
