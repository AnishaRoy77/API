const express = require('express');
const axios = require('axios');
const app = express();

let authToken = ''; 
app.post('/register', async (req, res) => {
  try {
    
    const registrationResponse = await axios.post('http://104.211.219.98/train/register', {
      companyName: 'Train Central',
      ownerName: 'Ram',
      rollNo: '1456',
      ownerEmail: 'ram@abc.edu',
      accessCode: 'siuzyt'
    });

    
    const { clientID, clientSecret } = registrationResponse.data;

  
    console.log('Registration successful!');
    console.log('Client ID:', clientID);
    console.log('Client Secret:', clientSecret);

    const authResponse = await axios.post('http://104.211.219.98/train/auth', {
      clientID: "b46128a0-fbde-4c16-a4b1-6ae6ad718e27",
      clientSecret:"XOyolORPayKBODAN",
      ownerName: 'Ram',
      companyName: 'Train Central',
      ownerEmail: 'ram@abc.edu',
      rollNo: '1456'
    });

    
    authToken = authResponse.data.access_token;
    console.log('Authorization successful!');
    console.log('Authorization Token:', authToken);

    res.sendStatus(200);
  } catch (error) {
    console.error('Registration or authorization failed due to invalidation :', error.message);
    res.sendStatus(500);
  }
});


app.get('/trains', async (req, res) => {
  try {
    
    const trainResponse = await axios.get('http://104.211.219.98/train/trains', {
      headers: {
        Authorization: `Bearer ${authToken}` 
      }
    });

    
    const trainDetails = trainResponse.data;
    console.log('Train details:', trainDetails);

    res.status(200).json(trainDetails);
  } catch (error) {
    console.error('Error retrieving the specific train details:', error.message);
    res.sendStatus(500);
  }
});


app.get('/trains/:trainNumber', async (req, res) => {
  try {
    const trainNumber = req.params.trainNumber;

    
    const specificTrainResponse = await axios.get(`http://104.211.219.98/train/trains/${trainNumber}`, {
      headers: {
        Authorization: `Bearer ${authToken}` 
      }
    });

   
    const specificTrainDetails = specificTrainResponse.data;
    console.log('Specific train details:', specificTrainDetails);

    res.status(200).json(specificTrainDetails);
  } catch (error) {
    console.error('Error retrieving the specified  train details:', error.message);
    res.sendStatus(500);
  }
});


const port = 3000;
app.listen(port, () => {
  console.log(`The Server is running on port ${port}`);
});
