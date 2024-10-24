const { GoogleSpreadsheet } = require('google-spreadsheet');
const credentials = require('./credentials.json');
const arquivo = require('./arquivo.json');
const { JWT } = require('google-auth-library');

const SCOPES = [
        'https://www.googleapis.com/auth/spreadsheets'
];

const jwt = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: SCOPES,
});

async function GetDoc() {
    console.log("Iniciando GetDoc...");
    const doc = new GoogleSpreadsheet(arquivo.id, jwt);
    await doc.loadInfo();
    return doc;
}

async function ReadWorkSheet() {
    console.log("Iniciando leitura da planilha...");
    let sheet = (await GetDoc()).sheetsByIndex[0];
    let rows = await sheet.getRows()
    let users = rows.map(row => {
        return row.toObject()
    })
    console.log("Usuários obtidos:", users);
    return users
}

async function AddUser(data = {}) {
    console.log("Adicionando usuário:", data);
    const response = await fetch("https://apigenerator.dronahq.com/api/ziz_1tkB/usuario", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
    console.log("Resposta da API recebida!");
    return response.json();
}

async function TrackData() {
    console.log("Iniciando TrackData...");
    let data = await ReadWorkSheet();
    data.map(async (user) => {
        let response = await AddUser(user)
        console.log("Resposta ao adicionar usuário:", response)
    })
    return console.log('Dados copiados com sucesso')
}

TrackData()