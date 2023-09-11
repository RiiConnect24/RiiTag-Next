import axios from 'axios';
import AdmZip from 'adm-zip';
import xml2js from 'xml2js';
import fs from 'fs-extra';
import path from 'path';
import { DATA } from '@/lib/constants/filePaths';

export async function downloadSwitchTDB(req, res) {
  const response = await fetch('https://www.gametdb.com/switchtdb.zip');

  if (response.status !== 200) {
    logger.error(`Failed downloading ${txtname}.txt`);
    return Promise.reject();
  }

  // Step 2: Unzip switchtdb.zip and save switchtdb.xml
  const zip = new AdmZip(response.body);
  try {
    zip.extractAllTo(path.resolve(DATA.IDS), true);
  } catch (error) {
    console.error('Error:', error);
  }

  // Step 3: Read and modify the XML
  const xmlData = await fs.readFile(path.resolve(DATA.IDS, 'switchtdb.xml'));
  const jsonData = await xml2js.parseStringPromise(xmlData, { explicitArray: false });

  // Step 4: Save the modified XML
  const builder = new xml2js.Builder();
  const modifiedXml = builder.buildObject(jsonData);
  await fs.writeFile(path.resolve(DATA.IDS, 'switchtdb.xml'), modifiedXml);

  // Step 5: Create switchtdb.json
  const gameData = jsonData.datafile.game;
  const gameMap = {};

  console.log(gameData);

  gameData.forEach((game) => {
    const name = game["$"].name.replace(/ \(EN\)$/, '');
    const id = game.id;
    if (!gameMap[name]) {
      gameMap[name] = [];
    }
    gameMap[name].push(id);
  });

  // Step 6: Sort the keys alphabetically
  const sortedGameMap = {};
  Object.keys(gameMap)
    .sort()
    .forEach((key) => {
      sortedGameMap[key] = gameMap[key];
    });

  await fs.writeFile(
    path.resolve(DATA.IDS, 'switchtdb.json'),
    JSON.stringify(sortedGameMap, null, 2)
  );
}