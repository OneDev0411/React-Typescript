// landing.js
import AppStore from '../../stores/AppStore'

export default {

  swapVideo: function(video_src){
    let new_video_src
    if(!video_src)
      new_video_src = 'couple'
    if(video_src === 'young_agent')
      new_video_src = 'couple'
    AppStore.data.video_src = new_video_src
    AppStore.emitChange()
  },

  startBlinking: function(){
    AppStore.data.blinking_cursor = true
    AppStore.emitChange()
  },

  stopBlinking: function(){
    AppStore.data.blinking_cursor = false
    AppStore.emitChange()
  },

  getText: function(animated_num){
    const data = AppStore.data
    let random_number = data.random_number
    let animated_text = ['smarter','faster','more responsive','more knowledgable']
    let current_text = animated_text[animated_num]
    return current_text
  },

  setText: function(current_text){
    AppStore.data.current_text = current_text
    AppStore.emitChange()
  },

  addText: function(animated_num){
    this.stopBlinking()
    let animated_text = this.getText(animated_num)
    let num = 0
    let partial_text
    let adding_text = setInterval(() => {
      partial_text = animated_text.slice(0, num)
      this.setText(partial_text)
      if(partial_text == animated_text){
          clearInterval(adding_text)
          setTimeout(() => {
            this.startBlinking()
          },1000)
          setTimeout(() => {
            this.removeText(animated_num)
          },3000)
        }
      num++
    }, 150)
  },

  removeText: function(animated_num){
    this.stopBlinking()
    let animated_text = this.getText(animated_num)
    let removing_text = setInterval(() => {
      animated_text = animated_text.slice(0, -1)
      this.setText(animated_text)
      if(!animated_text){
        clearInterval(removing_text)
        setTimeout(() => {
          this.startBlinking()
        },200)
        setTimeout(() => {
          let next_text = this.getText(animated_num+1)
          if(next_text){
            this.addText(animated_num+1)
          } else {
            this.addText(0)
          }
        }, 1500)
      }
    }, 150)
  },

  // Start animation
  animateText: function(){
    this.removeText(0)
  },

  init: function(random_number){
    if(!random_number)
        random_number = 0
    AppStore.data.random_number = random_number
    AppStore.data.current_text = this.getText(0)
    AppStore.data.animation_started = true
    AppStore.emitChange()
  }
}