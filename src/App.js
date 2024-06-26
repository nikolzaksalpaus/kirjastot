import logo from './logo.svg';
import './App.css';
import { createTheme, FormGroup, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { grey } from '@mui/material/colors';
import { ThemeProvider } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

function App() {
    const navigate = useNavigate();
    const location = useLocation();

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

      async function fetchLibraries(val){
        // Fetch data by library name
        const responseByName = await axios.get("https://api.kirjastot.fi/v4/library", { params: { "name": val } });
        const dataByName = responseByName.data.items;

        // Fetch data by city name
        const responseByCityName = await axios.get("https://api.kirjastot.fi/v4/library", { params: { "city.name": val } });
        const dataByCityName = responseByCityName.data.items;

        const combineData = dataByName.concat(dataByCityName) // Combine data without including duplicates
        setResult(combineData)
      }

    useEffect(() => { // on url change update value
        // Parse the query parameter from the URL
        const params = new URLSearchParams(location.search);
        const q = params.get('q');
        setValue(q || '');
        fetchLibraries(q || '');
    }, [location.search]);
      
  return (
    <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", paddingY: "10px" }}>
            <Box sx={{ background: "#ffffff", width: "60%", borderRadius: "5px", padding: "20px", boxSizing: "border-box", marginY: "10px" }}>
                <Typography variant="h1" sx={{ fontSize: "48px", fontWeight: "800", marginBottom: "24px" }}>Kirjastot</Typography>
                <FormGroup row sx={{ display: "flex", gap: "10px" }}>
                    <TextField sx={{ flexGrow: "1" }} id="standard-basic" label="Find a library" variant="outlined" value={value} onChange={e => setValue(e.target.value)} />
                    <Button sx={{ width: "100px" }} fullWidth variant="contained" disableElevation onClick={() => navigate("/?q="+value)}><FontAwesomeIcon icon={faMagnifyingGlass} /></Button>
                </FormGroup>
            </Box>
            { result.map((res) => {
                console.log(res.name, res.coverPhoto)
                return(
                <Box sx={{ background: "#ffffff", width: "60%", borderRadius: "5px", padding: "20px", boxSizing: "border-box", marginY: "10px" }}>
                    {res.coverPhoto && (
                        <a href={res.coverPhoto.large.url}>
                            <img src={res.coverPhoto.small.url} alt={res.name} style={{ borderRadius: "5px" }} />
                        </a>
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
