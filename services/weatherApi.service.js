import axios from 'axios';
import { getKeyValue, TOKEN_DICTINARY } from './storage.service.js';

const getWeather = async (city) => {
  const token = process.env.TOKEN ?? (await getKeyValue(TOKEN_DICTINARY.token));

  if (!token) {
    throw new Error(
      'Не задан ключ API, задайте его через команду -t [API_KEY]'
    );
  }

  const { data } = await axios.get(
    'https://api.openweathermap.org/data/2.5/weather',
    {
      params: {
        q: city,
        appid: token,
        lang: 'ru',
        unita: 'metric',
      },
    }
  );

  return data;
};

export { getWeather };