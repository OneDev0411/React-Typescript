// actions/rooms/upload-files.js
import Room from '../../models/Room'
import AppDispatcher from '../../dispatcher/AppDispatcher'
import AppStore from '../../stores/AppStore'
import async from 'async'

export default (user, room, files) => {
  async.eachSeries(files, (file, callback) => {
    const params = {
      access_token: user.access_token,
      id: room.id,
      files: [file]
    }
    Room.uploadFiles(params, (err, response) => {
      if (response.status === 200) {
        const data = response.body.data
        const image_url = data.url
        AppDispatcher.dispatch({
          action: 'create-message',
          user,
          room,
          image_url
        })
      }
      // console.log('fail', response)
      callback()
    })
  }, () => {
    delete AppStore.data.current_room.uploading_files
    AppStore.emitChange()
  })
}