import logo from './logo.svg';
import './App.css';
import { createTheme, FormGroup, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { grey } from '@mui/material/colors';
import { ThemeProvider } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function App() {
    const [value, setValue] = useState("")
    const [result, setResult] = useState([])

    const theme = createTheme({
        typography: {
          fontFamily: [
            'Mulish',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
        },
      });

      
  return (
    <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingY: "10px" }}>
            <Box sx={{ background: "#ffffff", width: "60%", borderRadius: "5px", padding: "20px", boxSizing: "border-box", marginY: "10px" }}>
                <Typography variant="h1" sx={{ fontSize: "48px", fontWeight: "800", marginBottom: "24px" }}>App name</Typography>
                <FormGroup row sx={{ display: "flex", gap: "10px" }}>
                    <TextField sx={{ flexGrow: "1" }} id="standard-basic" label="Find a library" variant="outlined" value={value} onChange={e => setValue(e.target.value)} />
                    <Button sx={{ width: "100px" }} fullWidth variant="contained" disableElevation onClick={async () => {
                        // Fetch data by library name
                        const responseByName = await axios.get("https://api.kirjastot.fi/v4/library", { params: { "name": value } });
                        const dataByName = responseByName.data.items;

                        // Fetch data by city name
                        const responseByCityName = await axios.get("https://api.kirjastot.fi/v4/library", { params: { "city.name": value } });
                        const dataByCityName = responseByCityName.data.items;

                        const combineData = dataByName.concat(dataByCityName) // Combine data without including duplicates
                        setResult(combineData)
                    }}><FontAwesomeIcon icon={faMagnifyingGlass} /></Button>
                </FormGroup>
            </Box>
            { result.map((res) => {
                console.log(res.name, res.coverPhoto)
                return(
                <Box sx={{ background: "#ffffff", width: "60%", borderRadius: "5px", padding: "20px", boxSizing: "border-box", marginY: "10px" }}>
                    {res.coverPhoto && (
                        <img src={res.coverPhoto.small.url} alt={res.name} style={{ borderRadius: "5px" }} />
                    )}
                    <Typography variant="h2" sx={{ fontSize: "32px", fontWeight: "600", marginTop: "20px" }}>{res.name}</Typography>
                    { res.description && <Typography sx={{ fontSize: "20px" }} dangerouslySetInnerHTML={{ __html: res.description }}></Typography> }
                    { res.address && <Typography sx={{ fontSize: "20px", color: "grey" }}>{res.address.street}, {res.address.city} {res.address.zipcode}</Typography> }
                </Box>
            )}) }
        </Box>
    </ThemeProvider>
  );
}

export default App;
