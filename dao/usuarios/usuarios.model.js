const ObjectId = require('mongodb').ObjectId;
const getDb = require('../mongodb');
const bcrypt = require('bcryptjs');

let db = null;
class Usuarios{
    collection = null;
    constructor(){
        getDb()
        .then((database) => {
          db = database;
          this.collection = db.collection('Usuarios');
          if (process.env.MIGRATE === 'true') {
            // Por Si se ocupa algo
            this.collection.createIndex({"email":1},{ unique: true})
            .then((rslt)=>{
              console.log("Indice creado satisfactoriamente", rslt);
            }
            )
            .catch((err)=>{
              console.error("Error al crear indice", err);
            });
          }
        })
        .catch((err) => { console.error(err) });
    }

    async new(email, password, roles=[]){
        const newUsuario = {
            email,
            password:await this.hashPassword(password),
            roles:[...roles,'public'],

        };
        const rslt = await this.collection.insert(newUsuario);
        return rslt;
    }
    
    async getById(id) {
        const _id = new ObjectId(id);
        const filter = { _id };
        const myDocument = await this.collection.findOne(filter);
        return myDocument;
      }

    async getAll(){
        const cursor = this.collection.find({});
        const myDocument = await cursor.toArray();
        return myDocument;
    }
    async getByEmail(email) {
        const filter = {email};
        return await this.collection.findOne(filter);
      }

    async hashPassword(rawPassword){
        return await bcrypt.hash(rawPassword,10);
    }

    async comparePassword (rawPassword, dbPassword) {
        return await bcrypt.compare(rawPassword, dbPassword);
      }

        //ACTUALIZAR LA CONTRASEÑA DEL USUARIO
     async updatePassword (id, rawPassword) {
    const filter = {_id: new ObjectId(id)};
    const updateCmd = {
      '$set': {
        password: await this.hashPassword(rawPassword)
      }
    };

    const result = await this.collection.updateOne(filter, updateCmd);
    return result;
  }

}
module.exports = Usuarios;