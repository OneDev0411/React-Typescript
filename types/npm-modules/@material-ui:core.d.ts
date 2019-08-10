import { Palette } from '@material-ui/core/styles/createPalette';

declare module "@material-ui/core/styles/createPalette"{

    interface Palette{

        warning: {
            main: string,
            dark: string,
            light: string
        }
    }
}