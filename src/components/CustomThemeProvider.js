import { colors, createTheme, ThemeProvider } from "@mui/material"



const CustomThemeProvider = ({ children }) => {


    const theme = createTheme({
        palette: {

            primary: colors.deepOrange,
            background: {
                paper: "#151515"
            },
            mode: "dark",
        }
    })


    return <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>

}

export default CustomThemeProvider