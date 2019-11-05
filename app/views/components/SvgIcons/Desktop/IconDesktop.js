import React from 'react'

function UndoIcon(props) {
  const { width = 16, height = 16 } = props

  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.1053 13.6579H9.05263C8.9968 13.6579 8.94325 13.6358 8.90377 13.5965C8.86429 13.5572 8.8421 13.5039 8.8421 13.4484V13.0285C8.8421 12.9729 8.86429 12.9196 8.90377 12.8803C8.94325 12.841 8.9968 12.8189 9.05263 12.8189H14.3158C14.7625 12.8189 15.1909 12.6423 15.5067 12.328C15.8226 12.0136 16 11.5872 16 11.1426V2.34297C16 1.89839 15.8226 1.47202 15.5067 1.15766C15.1909 0.843295 14.7625 0.666687 14.3158 0.666687H1.68421C1.23753 0.666687 0.809145 0.843295 0.493294 1.15766C0.177443 1.47202 0 1.89839 0 2.34297L0 11.1435C0 11.5881 0.177443 12.0144 0.493294 12.3288C0.809145 12.6432 1.23753 12.8198 1.68421 12.8198H6.94737C7.00306 12.8198 7.05648 12.8417 7.09594 12.8808C7.13539 12.92 7.15767 12.973 7.15789 13.0285V13.4475C7.15789 13.5031 7.13571 13.5564 7.09623 13.5957C7.05675 13.635 7.0032 13.6571 6.94737 13.6571H5.89474C5.6714 13.6571 5.4572 13.7454 5.29928 13.9026C5.14135 14.0597 5.05263 14.2729 5.05263 14.4952C5.05263 14.7175 5.14135 14.9307 5.29928 15.0879C5.4572 15.2451 5.6714 15.3334 5.89474 15.3334H10.1053C10.3286 15.3334 10.5428 15.2451 10.7007 15.0879C10.8586 14.9307 10.9474 14.7175 10.9474 14.4952C10.9474 14.2729 10.8586 14.0597 10.7007 13.9026C10.5428 13.7454 10.3286 13.6571 10.1053 13.6571V13.6579ZM1.68421 10.7244V2.76204C1.68421 2.6509 1.72857 2.54431 1.80753 2.46572C1.8865 2.38713 1.99359 2.34297 2.10526 2.34297H13.8947C14.0064 2.34297 14.1135 2.38713 14.1925 2.46572C14.2714 2.54431 14.3158 2.6509 14.3158 2.76204V10.7244C14.3158 10.8355 14.2714 10.9421 14.1925 11.0207C14.1135 11.0993 14.0064 11.1435 13.8947 11.1435H2.10526C2.04997 11.1435 1.99522 11.1326 1.94413 11.1116C1.89305 11.0905 1.84663 11.0596 1.80753 11.0207C1.76844 10.9818 1.73742 10.9356 1.71626 10.8848C1.6951 10.8339 1.68421 10.7794 1.68421 10.7244Z" fill="black"/>
    </svg>
    
  )
}

export default UndoIcon
