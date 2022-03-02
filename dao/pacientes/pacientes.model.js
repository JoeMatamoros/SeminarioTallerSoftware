const ObjectId = require('mongodb').ObjectId
const getDb = require('../mongodb');

let db = null;
class Pacientes { 
    
    collections=null;
    constructor() {
        getDb()
            .then((database) => {
                db = database;
                this.collections = db.collection('Pacientes');
                if (process.env.MIGRATE === 'true') {
                    
                }
            }).catch((err) => { console.error(err) });
    }
    //INSERTAR DATOS EN MONGODB
    async new(nombres, apellidos, identidad, email,telefono) {
        const newPaciente = { nombres, apellidos, identidad, email,telefono };
        const rslt = await this.collections.insert(newPaciente);
        return rslt;
    }
    
    //TRAER TODOS LOS DATOS DE LA DB
    async getAll() {
        const cursor = this.collections.find({});
        const documents = await cursor.toArray();
        return documents;
    }
    //TRAER POR ID
    async getById(id) {
        const _id = new ObjectId(id);
        const filter = { _id };
        const myDocument = this.collections.findOne(filter);
        return myDocument;
    }
    //ACTUALIZAR REGISTRO POR ID
    async updateOne(id, nombres, apellidos, identidad, email,telefono) {
        const filter = { _id: new ObjectId(id) };
        const updateCmd={'$set':{nombres, apellidos, identidad, email, telefono}};
        return await this.collections.updateOne(filter, updateCmd);
    }
    //BORRAR UN REGISTRO
    async deleteOne(id) {
        const filter = {_id: new ObjectId(id) }
        return await this.collections.deleteOne(filter);
    }
}

module.exports = Pacientes;