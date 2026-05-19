const axios = require('axios');

class WeatherService {
  async getWeatherByCity(city) {
    try {
      // Use ip-api.com (free, reliable, no key required)
      const geoResponse = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
      );
      const location = geoResponse.data.results?.[0];
      if (!location) throw new Error('City not found');

      const latitude = location.latitude;
      const longitude = location.longitude;
      const country = location.country || 'Unknown';

      const weatherResponse = await axios.get(
        'https://api.open-meteo.com/v1/forecast',
        {
          params: {
            latitude: latitude,
            longitude: longitude,
            current:
              'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
            timezone: 'auto',
          },
        },
      );

      const current = weatherResponse.data.current;

      return {
        location: city,
        country: country,
        main: {
          temp: current.temperature_2m,
          humidity: current.relative_humidity_2m,
          feels_like: current.temperature_2m,
        },
        wind: {
          speed: current.wind_speed_10m,
        },
        weather: [
          {
            description: this.getWeatherDescription(current.weather_code),
          },
        ],
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Weather fetch error:', error.message);
      throw error;
    }
  }

  async getWeatherMyCity() {
    try {
      const latitude = 25.6510621;
      const longitude = 88.7665915;
      const city = 'Chirirbandar';
      const country = 'Bangladesh';

      const weatherResponse = await axios.get(
        'https://api.open-meteo.com/v1/forecast',
        {
          params: {
            latitude: latitude,
            longitude: longitude,
            current:
              'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
            timezone: 'auto',
          },
        },
      );

      const current = weatherResponse.data.current;

      return {
        location: city,
        country: country,
        main: {
          temp: current.temperature_2m,
          humidity: current.relative_humidity_2m,
          feels_like: current.temperature_2m,
        },
        wind: {
          speed: current.wind_speed_10m,
        },
        weather: [
          {
            description: this.getWeatherDescription(current.weather_code),
          },
        ],
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Weather fetch error:', error.message);
      throw error;
    }
  }

  getWeatherDescription(code) {
    const descriptions = {
      0: 'clear sky',
      1: 'mainly clear',
      2: 'partly cloudy',
      3: 'overcast',
      45: 'fog',
      48: 'depositing rime fog',
      51: 'light drizzle',
      53: 'moderate drizzle',
      55: 'dense drizzle',
      61: 'slight rain',
      63: 'moderate rain',
      65: 'heavy rain',
      71: 'slight snow fall',
      73: 'moderate snow fall',
      75: 'heavy snow fall',
      80: 'slight rain showers',
      81: 'moderate rain showers',
      82: 'violent rain showers',
      85: 'slight snow showers',
      86: 'heavy snow showers',
      95: 'thunderstorm',
      96: 'thunderstorm with slight hail',
      99: 'thunderstorm with heavy hail',
    };
    return descriptions[code] || 'unknown conditions';
  }

  async getWeatherByCity(city) {
    try {
      const geoResponse = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
      );
      const location = geoResponse.data.results?.[0];

      if (!location) throw new Error('City not found');

      const weatherResponse = await axios.get(
        'https://api.open-meteo.com/v1/forecast',
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            current:
              'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
            timezone: 'auto',
          },
        },
      );

      const current = weatherResponse.data.current;

      return {
        location: city,
        country: location.country || 'Unknown',
        main: {
          temp: current.temperature_2m,
          humidity: current.relative_humidity_2m,
          feels_like: current.temperature_2m,
        },
        wind: {
          speed: current.wind_speed_10m,
        },
        weather: [
          {
            description: this.getWeatherDescription(current.weather_code),
          },
        ],
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Weather fetch by city error:', error.message);
      throw error;
    }
  }
}

module.exports = new WeatherService();
