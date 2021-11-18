import { ReactNode } from 'react'

import { makeStyles } from '@material-ui/core'

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
      maxWidth: '100%',
      objectFit: 'cover'
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

  return (
    <div className={classes.card} onClick={onClick}>
      <img
        alt={asset.label}
        src={asset.file.url}
        className={classes.imageThumbnail}
      />
      <div className={classes.actions}>{actions}</div>
    </div>
  )
}
