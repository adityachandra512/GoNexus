import axios from 'axios';

// @desc    Get flight options for an airport
// @route   GET /api/transport/flights/:airportCode
// @access  Private (or Public, depending on requirements)
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

export { getFlightOptions };