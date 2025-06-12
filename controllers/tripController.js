import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fallback station code mapping for major Indian cities
const stationMapping = {
  'mumbai': 'CSMT',
  'delhi': 'NDLS',
  'new delhi': 'NDLS',
  'bangalore': 'SBC',
  'bengaluru': 'SBC',
  'chennai': 'MAS',
  'kolkata': 'HWH',
  'pune': 'PUNE',
  'ahmedabad': 'ADI',
  'hyderabad': 'SC',
  'jaipur': 'JP',
  'lucknow': 'LKO',
  'kanpur': 'CNB',
  'nagpur': 'NGP',
  'indore': 'INDB',
  'bhopal': 'BPL',
  'vadodara': 'BRC',
  'surat': 'ST',
  'rajkot': 'RJT',
  'coimbatore': 'CBE',
  'kochi': 'ERS',
  'thiruvananthapuram': 'TVC',
  'guwahati': 'GHY',
  'patna': 'PNBE',
  'ranchi': 'RNC',
  'bhubaneswar': 'BBS',
  'visakhapatnam': 'VSKP',
  'vijayawada': 'BZA'
};

// Convert city to railway station code using fallback first, then Gemini
const convertCityToStationCode = async (cityName) => {
  // First try fallback mapping
  const normalizedCity = cityName.toLowerCase().trim();
  const stationCode = stationMapping[normalizedCity];
  
  if (stationCode) {
    console.log(`${cityName} → ${stationCode} (fallback)`);
    return stationCode;
  }

  // If not found in mapping, try Gemini with your endpoint format
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `What is the main railway station code for ${cityName} in India? Reply with only the station code (like NDLS, CSMT, MAS, SBC, etc.). If no major railway station exists, reply "NO_STATION".`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const geminiStationCode = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    
    if (geminiStationCode && geminiStationCode !== "NO_STATION") {
      console.log(`${cityName} → ${geminiStationCode} (Gemini)`);
      return geminiStationCode;
    }
  } catch (error) {
    console.error(`Gemini API failed for ${cityName}:`, error.message);
  }

  console.log(`No station code found for ${cityName}`);
  return null;
};

// ConfirmTKT API integration for real train fares
const fetchTrainData = async (srcCode, dstCode, date) => {
  try {
    console.log(`Searching trains via ConfirmTKT: ${srcCode} → ${dstCode} on ${date}`);
    
    const url = "https://cttrainsapi.confirmtkt.com/api/v1/trains/search";
    const params = new URLSearchParams({
      "sourceStationCode": srcCode,
      "destinationStationCode": dstCode,
      "addAvailabilityCache": "true",
      "excludeMultiTicketAlternates": "false",
      "excludeBoostAlternates": "false",
      "sortBy": "DEFAULT",
      "dateOfJourney": date,
      "enableNearby": "true",
      "enableTG": "true",
      "tGPlan": "CTG-3",
      "showTGPrediction": "false",
      "tgColor": "DEFAULT",
      "showPredictionGlobal": "true"
    });

    // Randomized headers to avoid detection
    const userAgents = [
      {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "sec-ch-ua": '"Google Chrome";v="122", "Chromium";v="122", "Not.A/Brand";v="24"',
        "sec-ch-ua-platform": '"Windows"'
      },
      {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
        "sec-ch-ua": '"Chromium";v="137", "Not/A)Brand";v="24"',
        "sec-ch-ua-platform": '"macOS"'
      }
    ];
    
    const selectedUA = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    const headers = {
      "Accept": "*/*",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
      "ApiKey": "ct-web!2$",
      "ClientId": "ct-web",
      "Content-Type": "application/json",
      "DNT": "1",
      "DeviceId": uuidv4(),
      "Origin": "https://www.confirmtkt.com",
      "Referer": "https://www.confirmtkt.com/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "sec-ch-ua-mobile": "?0",
      ...selectedUA
    };

    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers,
      timeout: 15000
    });

    if (!response.ok) {
      throw new Error(`ConfirmTKT API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('ConfirmTKT API success - Found trains with real fares');
    
    const trainList = data.data?.trainList || [];
    console.log(`Processed ${trainList.length} trains with ConfirmTKT fares`);
    
    return {
      success: true,
      trains: trainList,
      count: trainList.length,
      source: 'ConfirmTKT'
    };
  } catch (error) {
    console.error('ConfirmTKT API failed:', error.message);
    
    // Fallback to original API
    try {
      console.log('Trying fallback train API...');
      const fallbackResponse = await fetch('https://traininfo-diik.onrender.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ src: srcCode, dst: dstCode, date: date })
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const fallbackTrains = fallbackData.data?.trainList || fallbackData.trains || [];
        console.log(`Fallback API returned ${fallbackTrains.length} trains`);
        
        return {
          success: true,
          trains: fallbackTrains,
          count: fallbackTrains.length,
          source: 'Fallback',
          fallback: true
        };
      }
    } catch (fallbackError) {
      console.error('Fallback API also failed:', fallbackError.message);
    }
    
    return { success: false, error: error.message };
  }
};

// Format train data with real ConfirmTKT fares
const formatTrainData = (trains, source = 'ConfirmTKT') => {
  return trains.slice(0, 10).map((train, index) => {
    console.log(`Processing ${source} train:`, train.trainName, 'with availability:', Object.keys(train.availabilityCache || {}));
    
    return {
      service: train.trainName,
      trainNumber: train.trainNumber,
      price: getLowestFareFromCache(train.availabilityCache || train.availability),
      duration: formatDuration(train.duration),
      rating: 4.5,
      features: ['Reserved Seating', 'Onboard Catering', 'AC Coaches'],
      availability: train.availabilityCache || train.availability,
      popular: index === 0,
      eco: true,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      distance: train.distance,
      source: source
    };
  });
};

// Extract real fares from ConfirmTKT response
const getLowestFareFromCache = (availabilityCache) => {
  if (!availabilityCache || typeof availabilityCache !== 'object') return '₹500';
  
  const fares = Object.values(availabilityCache)
    .map(item => {
      // ConfirmTKT structure: { "availability": "AVAILABLE-25", "fare": "850", "tatkal": "1050" }
      if (typeof item === 'object' && item.fare) {
        return parseInt(item.fare) || 500;
      }
      return 500;
    })
    .filter(fare => fare > 0);
  
  return fares.length > 0 ? `₹${Math.min(...fares)}` : '₹500';
};

// Helper function to format duration
const formatDuration = (durationMinutes) => {
  if (!durationMinutes) return '6h 30m';
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return `${hours}h ${minutes}m`;
};

// Main trip planning function
export const planTrip = async (req, res) => {
  try {
    const { origin, destination, startDate, endDate, budget, preferences } = req.body;

    if (!origin || !destination || !startDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide origin, destination, and start date'
      });
    }

    console.log(`Planning trip with ConfirmTKT API: ${origin} → ${destination} on ${startDate}`);

    // Step 1: Convert cities to station codes
    const [originStationCode, destStationCode] = await Promise.all([
      convertCityToStationCode(origin),
      convertCityToStationCode(destination)
    ]);

    console.log('Station codes:', { originStationCode, destStationCode });

    // Step 2: Get real train data with fares from ConfirmTKT
    let trainOptions = [];
    
    if (originStationCode && destStationCode) {
      const trainResult = await fetchTrainData(
        originStationCode,
        destStationCode,
        startDate.split('-').reverse().join('-') // Convert YYYY-MM-DD to DD-MM-YYYY
      );

      if (trainResult.success && trainResult.trains.length > 0) {
        trainOptions = formatTrainData(trainResult.trains, trainResult.source);
        console.log(`Successfully processed ${trainResult.trains.length} trains from ${trainResult.source}`);
        
        if (trainResult.fallback) {
          trainOptions[0].features = ['Fallback Data - Limited Fares', ...trainOptions[0].features];
        }
      } else {
        trainOptions = [{
          service: 'No trains found for this route',
          price: '---',
          duration: '---',
          rating: 0,
          features: ['Try different dates', 'Check route availability'],
          eco: true
        }];
      }
    } else {
      const missing = [];
      if (!originStationCode) missing.push(origin);
      if (!destStationCode) missing.push(destination);
      
      trainOptions = [{
        service: `No railway station found for: ${missing.join(', ')}`,
        price: '---',
        duration: '---',
        rating: 0,
        features: ['Try major cities like Mumbai, Delhi, Bangalore'],
        eco: true
      }];
    }

    // Return response with real train fare data
    res.json({
      success: true,
      tripData: {
        origin,
        destination,
        originStationCode,
        destStationCode,
        startDate,
        endDate,
        budget,
        preferences
      },
      transportOptions: {
        train: trainOptions,
        car: [
          {
            service: 'Ola Premium',
            price: '₹1,200',
            duration: '16h 30m',
            rating: 4.8,
            features: ['AC', 'Professional Driver', 'GPS Tracking'],
            savings: '15% off'
          },
          {
            service: 'Uber Black',
            price: '₹1,500',
            duration: '16h 15m',
            rating: 4.9,
            features: ['Luxury Vehicle', 'Premium Service', 'Wi-Fi Available'],
            popular: true
          }
        ],
        bus: [
          {
            service: 'Volvo Sleeper',
            price: '₹800',
            duration: '18h 30m',
            rating: 4.2,
            features: ['Sleeper Berths', 'AC', 'Entertainment'],
            bestValue: true
          },
          {
            service: 'Premium Coach',
            price: '₹1,200',
            duration: '17h 50m',
            rating: 4.4,
            features: ['Reclining Seats', 'Entertainment System', 'Refreshments']
          }
        ],
        flight: [
          {
            service: 'IndiGo Economy',
            price: '₹4,500',
            duration: '2h 15m',
            rating: 4.6,
            features: ['Fastest Option', 'In-flight Service'],
            fastest: true
          },
          {
            service: 'Air India Business',
            price: '₹12,000',
            duration: '2h 15m',
            rating: 4.9,
            features: ['Premium Lounge Access', 'Priority Check-in', 'Gourmet Meals'],
            luxury: true
          }
        ]
      }
    });

  } catch (error) {
    console.error('Trip planning failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to plan trip. Please try again.'
    });
  }
};
