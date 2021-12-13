import { ReactNode } from 'react'

import { makeStyles } from '@material-ui/core'

import { PdfThumbnail } from '../PdfThumbnail'
import { VideoThumbnail } from '../VideoThumbnail'

const useStyles = makeStyles(
  theme => ({
    card: {
      cursor: 'pointer',
      marginBottom: theme.spacing(4),
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      borderRadius: 3,
      transition: '0.3s',
      minHeight: '15.8rem',
      background: theme.palette.grey['200'],
      overflow: 'hidden',
      boxShadow: theme.shadows[2],
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.2)',
        opacity: 0,
        zIndex: 1,
        transition: 'all 0.5s'
      },
      '&:hover': {
        '& $actions': {
          opacity: 1,
          transform: 'translateY(0)'
        },
        '&::after': {
          opacity: 1
        }
      }
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      width: '100%',
      position: 'absolute',
      bottom: 0,
      left: 0,
      padding: '0.5rem',
      zIndex: 2,
      opacity: 0,
      transform: 'translateY(0.5rem)',
      transition: 'all 0.35s',

      '& button': {
        marginRight: '0.5rem'
      },
      '& button:last-child': {
        marginRight: 0
      }
    },
    imageThumbnail: {
      width: '100%',
      objectFit: 'cover'
    },
    videoThumbnail: {
      width: '100%',
      zIndex: 2
    }
  }),
  {
    name: 'BrandAssetCard'
  }
)

interface Props {
  asset: IBrandAsset
  actions?: ReactNode
  onClick: () => void
}

export default function BrandAssetCard({ asset, actions, onClick }: Props) {
  const classes = useStyles()

  const renderThumbnail = () => {
    if (asset.file.url.endsWith('.pdf')) {
      return <PdfThumbnail url={asset.file.url} />
    }

    if (asset.file.url.endsWith('.mp4')) {
      return (
        <VideoThumbnail
          url={asset.file.url}
          className={classes.videoThumbnail}
        />
      )
    }

    return (
      <img
        src={asset.file.url}
        alt={asset.label}
        className={classes.imageThumbnail}
      />
    )
  }

  return (
    <div className={classes.card} onClick={onClick}>
      {renderThumbnail()}
      <div className={classes.actions}>{actions}</div>
    </div>
  )
}
