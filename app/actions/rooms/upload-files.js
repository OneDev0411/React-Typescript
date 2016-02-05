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
    Room.uploadFiles(params, request => {
      request.on('progress', e => {
        const upload_percent = e.percent
        AppStore.data.current_room.upload_percent = upload_percent
        AppStore.emitChange()
      })
      request.end((err, res) => {
        if (err)
          return err
        const image_url = res.body.url
        const attachment = res.body.attachment
        delete AppStore.data.current_room.upload_percent
        delete AppStore.data.current_room.uploading_files
        AppStore.emitChange()
        AppDispatcher.dispatch({
          action: 'create-message',
          user,
          room,
          image_url,
          attachment
        })
        callback()
      })
    })
  }, () => {
    delete AppStore.data.current_room.uploading_files
    AppStore.emitChange()
  })
}