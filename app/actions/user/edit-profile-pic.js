// actions/user/edit-profile-pic.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'
import async from 'async'

export default (user, files) => {
  const params = {
    access_token: user.access_token,
    files
  }
  async.waterfall([
    callback => {
      User.uploadImage(params, (err, response) => {
        const data = response.body
        return callback(null, data)
      })
    },
    data => {
      const response_params = {
        access_token: user.access_token,
        profile_image_url: data.url
      }
      User.editProfilePic(response_params, (err, response) => {
        if (response.status === 'success') {
          const user_edited = response.data
          AppStore.data.user.profile_image_url = user_edited.profile_image_url
          delete AppStore.data.uploading_profile_pic
          AppStore.emitChange()
        }
      })
    }
  ])
}