import axios from 'axios';

// Original function for single airport
const getFlightOptions = async (req, res) => {
  const { airportCode } = req.params;

  const options = {
    method: 'GET',
    url: `https://${process.env.RAPIDAPI_HOST}/flights/airports/icao/${airportCode}`,
    params: {
      offsetMinutes: '-120',
      durationMinutes: '720',
      withLeg: 'true',
      direction: 'Both',
      withCancelled: 'true',
      withCodeshared: 'true',
      withCargo: 'true',
      withPrivate: 'true',
      withLocation: 'false'
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching flight data:', error);
    if (error.response) {
      res.status(error.response.status).json({
        message: error.response.data.message || 'Error fetching flight data from external API'
      });
    } else if (error.request) {
      res.status(500).json({
        message: 'No response received from external API'
      });
    } else {
      res.status(500).json({
        message: error.message || 'An unexpected error occurred'
      });
    }
  }
};

// New function for searching flights between airports
const searchFlights = async (req, res) => {
  const { departureIATA, destinationIATA, date } = req.body;

  const options = {
    method: 'GET',
    url: `https://${process.env.RAPIDAPI_HOST}/flights/routes`,
    params: {
      departureAirport: departureIATA,
      arrivalAirport: destinationIATA,
      date: date
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching flight routes:', error);
    if (error.response) {
      res.status(error.response.status).json({
        message: error.response.data.message || 'Error fetching flight routes from external API'
      });
    } else if (error.request) {
      res.status(500).json({
        message: 'No response received from external API'
      });
    } else {
      res.status(500).json({
        message: error.message || 'An unexpected error occurred'
      });
    }
  }
};

export { getFlightOptions, searchFlights };