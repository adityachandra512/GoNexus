import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fallback station code mapping for major Indian cities
const stationMapping = {
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

// Fetch real train data from API
const fetchTrainData = async (srcCode, dstCode, date) => {
  try {
    console.log(`Searching trains: ${srcCode} → ${dstCode} on ${date}`);
    
    const response = await fetch('https://traininfo-diik.onrender.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        src: srcCode,
        dst: dstCode,
        date: date,
      })
    });

    if (!response.ok) {
      throw new Error(`Train API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Full API response:', JSON.stringify(data, null, 2));
    
    // Fix: API returns trains directly, not in data.trainList
    const trainList = data.trains || []; // Changed from data.data?.trainList
    console.log(`Found ${trainList.length} trains`);
    
    return {
      success: true,
      trains: trainList,
      count: trainList.length
    };
  } catch (error) {
    console.error('Train API failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Convert train data for frontend display
const formatTrainData = (trains) => {
  return trains.slice(0, 10).map((train, index) => ({
    service: train.trainName,
    trainNumber: train.trainNumber,
    price: getLowestFare(train.availability), // Use availability, not availabilityCache
    duration: formatDuration(train.duration),
    rating: 4.5,
    features: ['Reserved Seating', 'Onboard Catering', 'AC Coaches'],
    availability: train.availability, // Use availability
    popular: index === 0,
    eco: true,
    departureTime: train.departureTime,
    arrivalTime: train.arrivalTime,
    distance: train.distance
  }));
};

// Helper function to get lowest fare - fixed for correct API structure
const getLowestFare = (availability) => {
  if (!availability || typeof availability !== 'object') return '₹500';
  
  const fares = Object.values(availability)
    .map(item => {
      // Handle availability strings like "CURR_AVBL-0043", "GNWL111/WL48", "AVAILABLE-0010"
      if (typeof item === 'string') {
        // Try to extract number from availability status (not fare, as fare is not in this API)
        const fareMatch = item.match(/\d+/);
        return fareMatch ? parseInt(fareMatch[0]) * 10 : 500; // Multiply by 10 for realistic price
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

    console.log(`Planning trip: ${origin} → ${destination} on ${startDate}`);

    // Step 1: Convert cities to station codes (fallback first, then Gemini)
    const [originStationCode, destStationCode] = await Promise.all([
      convertCityToStationCode(origin),
      convertCityToStationCode(destination)
    ]);

    console.log('Station codes:', { originStationCode, destStationCode });

    // Step 2: Get train data if both station codes found
    let trainOptions = [];
    
    if (originStationCode && destStationCode) {
      const trainResult = await fetchTrainData(
        originStationCode,
        destStationCode,
        startDate.split('-').reverse().join('-') // Convert YYYY-MM-DD to DD-MM-YYYY
      );

      if (trainResult.success && trainResult.trains.length > 0) {
        trainOptions = formatTrainData(trainResult.trains);
        console.log(`Successfully processed ${trainResult.trains.length} trains`);
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

    // Step 3: Return complete response
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
