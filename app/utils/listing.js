export default {
  getStatusColor: (status) => {
    let status_color = 'c3c3c3'
    if (status) {
      if (status === 'Active')
        status_color = '35b863'
      if (status === 'Active Contingent')
        status_color = 'f8b619'
      if (status === 'Expired' || status === 'Sold')
        status_color = 'db3821'
    }
    return status_color
  },
  metersToFeet: (meters) => {
    return meters * '10.7639'
  }
}