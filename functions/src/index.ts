import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';

// Inicializando proyecto y CORS
admin.initializeApp();
const cors = require("cors")({
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: '*',
    preflightContinue: false,
});
const parseString = require('xml2js').parseString;
// Inicializando proyecto CORS
// Funcion para leer un archivo
export const readFile = functions.https.onRequest((request, response) => {
    cors(request, response, () => { return true; });
    const xmlToProcess: string = request.body.toString();
    const fileLines: any[] = xmlToProcess.split('\n');
    fileLines.splice(0, 4);
    const resultXML = fileLines.join('\n');
    parseString(`${resultXML.replace('\ufeff', '')}`, (error: any, result: any) => {
        if (error) {
            response.status(400).send({status: false, data: error})
        } else {
            let listToProccess: any[] = result.students.student;
            for (let index = 0; index < listToProccess.length; index++) {
                const element = listToProccess[index];
                for (const key in element) {
                    element[key] = element[key][0];
                }   
            }
            response.status(200).send({status: true, data: result.students.student});
        }
    });
});
// Funcion para leer un archivo
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
