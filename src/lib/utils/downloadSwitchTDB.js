import axios from 'axios';
import AdmZip from 'adm-zip';
import xml2js from 'xml2js';
import fs from 'fs-extra';
import path from 'path';

export default async (req, res) => {
    try {
        // Step 1: Download switchtdb.zip
        const response = await axios.get('https://www.gametdb.com/switchtdb.zip', {
            headers: {
                'User-Agent': 'RiiTag',
            },
            responseType: 'arraybuffer',
        });

        // Step 2: Unzip switchtdb.zip and save switchtdb.xml
        const zip = new AdmZip(response.data);
        zip.extractEntryTo('switchtdb.xml', path.resolve(DATA.IDS, 'switchtdb.xml'));

        // Step 3: Read and modify the XML
        const xmlData = await fs.readFile(path.resolve(DATA.IDS, 'switchtdb.xml'));
        const jsonData = await xml2js.parseStringPromise(xmlData, { explicitArray: false });

        // Scrubbing logic (modify jsonData as needed)

        // Step 4: Save the modified XML
        const builder = new xml2js.Builder();
        const modifiedXml = builder.buildObject(jsonData);
        await fs.writeFile(path.resolve(DATA.IDS, 'switchtdb.xml'), modifiedXml);

        // Step 5: Create switchtdb.json
        const gameData = jsonData.datafile.game;
        const gameMap = {};

        gameData.forEach((game) => {
            const name = game.name.replace(/ \(EN\)$/, '');
            const id = game.id;
            if (!gameMap[name]) {
                gameMap[name] = [];
            }
            gameMap[name].push(id);
        });

        await fs.writeFile(
            path.resolve(DATA.IDS, 'switchtdb.json'),
            JSON.stringify(gameMap, null, 2)
        );

        // Step 6: Sort the keys alphabetically
        const sortedGameMap = {};
        Object.keys(gameMap)
            .sort()
            .forEach((key) => {
                sortedGameMap[key] = gameMap[key];
            });

        // Step 7: Respond with the sorted JSON data
        res.status(200).json(sortedGameMap);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};