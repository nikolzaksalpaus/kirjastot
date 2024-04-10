import logo from './logo.svg';
import './App.css';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { grey } from '@mui/material/colors';

function App() {
    const [value, setValue] = useState("")
    const [result, setResult] = useState([])
  return (
    <Box className="App">
        <TextField id="standard-basic" label="Standard" variant="standard" value={value} onChange={e => setValue(e.target.value)} />
        <Button variant="contained" onClick={async () => {
            // Fetch data by library name
            const responseByName = await axios.get("https://api.kirjastot.fi/v4/library", { params: { "name": value } });
            const dataByName = responseByName.data.items;

            // Fetch data by city name
            const responseByCityName = await axios.get("https://api.kirjastot.fi/v4/library", { params: { "city.name": value } });
            const dataByCityName = responseByCityName.data.items;

            const combineData = dataByName.concat(dataByCityName) // Combine data without including duplicates
            setResult(combineData)
        }}>Find</Button>
        { result.map((res) => {
            console.log(res.name, res.coverPhoto)
            return(
            <Box>
                {res.coverPhoto ? (
                    <img src={res.coverPhoto.small.url} alt={res.name} />
                ) : (
                    <Paper elevation={3} sx={{width: 200, height: 150}} />
                )}
                <Typography>{res.name}</Typography>
                { res.address && <Typography>{res.address.street}, {res.address.city} {res.address.zipcode}</Typography> }
                { res.description && <Box dangerouslySetInnerHTML={{ __html: res.description }}></Box> }
            </Box>
        )}) }
    </Box>
  );
}

export default App;
