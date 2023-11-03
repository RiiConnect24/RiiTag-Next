import AdmZip from 'adm-zip';
import xml2js from 'xml2js';
import fs from 'fs-extra';
import path from 'node:path';
import { saveFile } from '@/lib/utils/fileUtils';
import { DATA } from '@/lib/constants/filePaths';

export async function downloadSwitchTDB() {
    const response = await fetch('https://www.gametdb.com/switchtdb.zip');

    if (response.status !== 200) {
        return Promise.reject();
    }

    saveFile(path.resolve(DATA.IDS, 'switchtdb.zip'), response.body);

    // Step 2: Unzip switchtdb.zip and save switchtdb.xml
    const zip = new AdmZip(path.resolve(DATA.IDS, 'switchtdb.zip'));
    zip.extractAllTo(path.resolve(DATA.IDS), true);

    fs.remove(path.resolve(DATA.IDS, 'switchtdb.zip'));

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

    gameData.forEach((game) => {
        const name = game.$.name.split(/ \(/)[0];
        const { id } = game;
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

    return null;
}
