#!/usr/bin/env node
import { getArgs } from './helpers/args.js';
import {
  printHelp,
  printSuccess,
  printError,
  printWeather,
} from './services/log.service.js';
import {
  saveKeyValue,
  getKeyValue,
  TOKEN_DICTINARY,
} from './services/storage.service.js';
import { getWeather, getIcon } from './services/weatherApi.service.js';

const saveToken = async (token) => {
  if (!token.length) {
    printError('Не передан токен');
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTINARY.token, token);
    printSuccess('Токен успешно сохранен');
  } catch (e) {
    printError(e.message);
  }
};

const saveCity = async (city) => {
  if (!city.length) {
    printError('Не передан город');
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTINARY.city, city);
    printSuccess('Город успешно сохранен');
  } catch (e) {
    printError(e.message);
  }
};

const getForcast = async () => {
  try {
    const city = process.env.CITY ?? (await getKeyValue(TOKEN_DICTINARY.city));
    const weather = await getWeather(city);

    printWeather(weather, getIcon(weather.weather[0].icon));
  } catch (e) {
    if (e?.response?.status == 404) {
      printError('Не верно указан город');
    } else if (e?.response?.status == 401) {
      printError('Не верно указан токен');
    } else {
      printError(e.message);
    }
  }
};

const initCLI = async () => {
  const args = getArgs(process.argv);

  if (args.h) {
    return printHelp();
  }

  if (args.s) {
    return saveCity(args.s);
  }

  if (args.t) {
    return saveToken(args.t);
  }

  return await getForcast();
};

initCLI();
