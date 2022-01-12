#!/usr/bin/env node
import { getArgs } from './helpers/args.js';
import { printHelp, printSuccess, printError } from './services/log.service.js';
import { saveKeyValue, TOKEN_DICTINARY } from './services/storage.service.js';
import { getWeather } from './services/weatherApi.service.js';

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

const getForcast = async () => {
  try {
    const weather = await getWeather(process.env.CITY);
    console.log(weather);
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
    printHelp();
  }

  if (args.s) {
    //Сохранение города
  }

  if (args.t) {
    return saveToken(args.t);
  }

  await getForcast();
};

initCLI();
