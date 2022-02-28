import { Box, Typography, Avatar } from '@material-ui/core'

interface FacebookPageListImageNameProps {
  image: string
  name: string
}

function FacebookPageListImageName({
  image,
  name
}: FacebookPageListImageNameProps) {
  return (
    <Box display="flex" alignItems="center">
      <Box mr={2}>
        <Avatar src={image} alt={name} />
      </Box>
      <Typography variant="body2">{name}</Typography>
    </Box>
  )
}

export default FacebookPageListImageName
