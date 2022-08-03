import { Box } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

export function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 2 }).map((_, key) => (
        <Box
          key={key}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mx={2}
          my={2}
        >
          <Box display="flex" alignItems="center">
            <Skeleton variant="circle" width={40} height={40} />

            <Box ml={2}>
              <Skeleton variant="text" width="150px" />
              <Skeleton variant="text" width="150px" />
            </Box>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            justifyContent="center"
          >
            <Skeleton variant="text" width="100px" />
          </Box>
        </Box>
      ))}
    </>
  )
}
