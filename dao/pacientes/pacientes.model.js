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
    async new(nombres, apellidos, identidad, telefono, correo) {
        const newPaciente = { nombres, apellidos, identidad, telefono, correo };
        const rslt = await this.collections.insert(newPaciente);
        return rslt;
    }

    async getAll() {
        
    }

    async getById(id) {
        
    }

    async updateOne(id, nombres, apellidos, identidad, telefono, correo) {
     
    }

    async deleteOne(id) {
        
    }
}

module.exports = Pacientes;