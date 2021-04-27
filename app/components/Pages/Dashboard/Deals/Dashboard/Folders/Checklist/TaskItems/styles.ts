import { makeStyles, Theme } from '@material-ui/core'

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
      height: theme.spacing(8),
      paddingRight: theme.spacing(2),
      backgroundColor: 'inherit',
      transition: '0.1s ease-in background-color',

      '&:hover': {
        backgroundColor: theme.palette.info.ultralight,
        cursor: 'pointer'
      }
    },
    row: {
      width: '100%',
      paddingLeft: theme.spacing(3)
    },
    title: {
      margin: theme.spacing(0, 1),
      color: '#000',
      ...theme.typography.body2
    },
    subtitle: {
      color: theme.palette.grey['500'],
      ...theme.typography.subtitle3
    },
    date: {
      color: theme.palette.grey['700'],
      marginTop: theme.spacing(0.5),
      marginLeft: theme.spacing(1),
      ...theme.typography.caption
    },
    link: {
      color: '#000'
    },
    horizontalLine: {
      width: theme.spacing(3),
      height: '1px',
      borderBottom: `1px dashed ${theme.palette.grey['500']}`
    }
  }),
  {
    name: 'Deals-Checklist-TaskItems'
  }
)

// import styled from 'styled-components'

// import LinkButton from 'components/Button/LinkButton'
// import { grey } from 'views/utils/colors'

// export const Container = styled.div`
//   justify-content: space-between;
//   align-items: center;
// `

// export const ItemContainer = styled.div`
//   width: 100%;
//   background-color: #f7f7f7;

//   :hover {
//     background-color: #f2f2f2;
//   }
// `

// export const ItemTitle = styled.div`
//   font-size: 1rem;
//   font-weight: 500;
// `

// export const ItemDate = styled.div`
//   font-size: 0.875rem;
//   font-weight: 500;
//   color: ${grey.A900};
// `

// export const ItemLink = styled(LinkButton)`
//   color: #000;
//   font-size: 1rem;
//   font-weight: 500;
//   padding: 0 1rem 0 0;
//   margin: 0;
//   white-space: normal;
//   line-height: 1.8;
// `

// export const ItemRow = styled.div`
//   display: flex;
//   flex-direction: column;

//   border-bottom: solid 1px #e6e6e6;
//   padding: 0.825rem 1rem;
//   padding-left: 3rem;
// `
