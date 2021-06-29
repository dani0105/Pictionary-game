const Config    = require('../config/config');
const { Client }    = require('pg');

/**
 *  Inserta nuevas palabras en el sistema 
 *  @param { word:string, lang:string } req informacion de la palabra que se desea insertar 
 *  @returns { success: boolean, id_new: integer }
 */
exports.add_word = async (req) => {
    const client = new Client(Config.database);
    try {
        await client.connect();
        let data = await client.query('call add_word($1,$2)', [
            req.word,
            req.lang
        ]).then(result => {
            return result.rows[0];
        }).catch(error => {
            throw error;
        });
        client.end();
        return data
    }catch (error) {
        client.end();
        throw error;
    }
}

/**
 *  consigue de manera aleatoria una x cantidad de palabras segun el idioma 
 *  que se requiere 
 * @param { lang:string, size:number } req informacion de la consulta 
 * @returns { success: boolean, data: array }
 */
exports.get_word = async (req) => {
    const client = new Client(Config.database);
    try {
        await client.connect();
        let data = await client.query('select * from get_word($1,$2)', [
            req.lang,
            req.size
        ]).then(result => {
            return {success:true,data:result.rows};
        }).catch(error => {
            throw error;
        });
        client.end();
        return data
    }catch (error) {
        client.end();
        console.log(error)
        throw error;
    }
}

module.exports;