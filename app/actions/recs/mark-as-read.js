// actions/recs/mark-as-read.js
import Rec from '../../models/Rec'
export default (user, recommendations) => {
  const params = {
    access_token: user.access_token,
    recommendations
  }
  Rec.mark(params, (err, res) => {
    console.log(err, res)
  })
}