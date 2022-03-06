const ObjectId = require('mongodb').ObjectId;
const getDb = require('../mongodb');
let db = null;
class Expedientes {
    collections = null;
    constructor() {
        getDb()
        .then((database) => {
            db = database;
            this.collections = db.collection('Expedientes');
            if (process.env.MIGRATE === 'true') {
                
            }
        }).catch((err) => { console.error(err) });
    }
   /*Insertar Registro en MongoDb*/
    async new (identidad, fecha, descripcion,observacion,registros,ultimaActualizacion){
        const newExpediente = {identidad, fecha, descripcion, observacion, registros, ultimaActualizacion};
        const rslt = await this.collections.insert(newExpediente);
        return rslt;
    }

    /*Traer todos los registros en MongoDb */
    async getAll() {
        const cursor = this.collections.find({});
        const documents = await cursor.toArray();
        return documents;
    }

    async getById(id){
        const _id= new ObjectId(id);
        const filter = {_id};
        const myDocument= this.collections.findOne(filter);
        return myDocument;
    }

    async updateOne(id, identidad, fecha, descripcion, observacion, registros, ultimaActualizacion){
        const filter = {_id: new ObjectId(id) };
        const updateCmd = {'$set':{identidad, fecha, descripcion, observacion, registros, ultimaActualizacion}};
        return await this.collections.updateOne(filter, updateCmd);
    }

    async deleteOne(id){
        const filter = {_id: new ObjectId(id) };
        return await this.collections.deleteOne(filter);
    }

}

module.exports = Expedientes;