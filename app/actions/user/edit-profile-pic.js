// actions/user/edit-profile-pic.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default async files => {
  try {
    const user = await User.uploadImage(files[0])

    AppStore.data.user.profile_image_url = user.profile_image_url

    delete AppStore.data.uploading_profile_pic

    AppStore.emitChange()
  } catch (error) {}
}
