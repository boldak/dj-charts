var fs = require('fs');
var Promise = require("bluebird");

class DDLAlterImplError extends Error {
  constructor(message) {
    super(message);
    this.name = "ddl.alter error";
  }
}

module.exports = {
    name: "ddl.alter",
    synonims: {
        "ddl.alter":"ddl.alter",
        "ddl.modify":"ddl.alter"
    },

    "internal aliases":{
        "model":"model",
        "for":"model",
        "entity":"model",
        "collection":"model",
        "schema":"model",
        "as": "model",
        "type": "name"
    },

    defaultProperty: {
        "ddl.alter":"model",
        "ddl.modify":"model"
    },

   

    execute: function(command, state) {
        return new Promise((resolve, reject) => {
            Entities
                .findOne({name:command.settings.name.toLowerCase()})
                .then((col) => {
                    if (!col){
                        reject(new DDLAlterImplError(`Collection '${command.settings.name}' not found`))
                        return
                    }

                    fs.writeFileSync(   `./api/models/${command.settings.name}.js`, 
                                `module.exports = ${JSON.stringify(command.settings.model)}`
                            );
                    try {
                        Entities.update(
                            {name: command.settings.name},
                            {
                                name: command.settings.name,
                                schema: command.settings.model
                            }).then((res) => {
                                try {
                                    sails.hooks.orm.reload()
                                    state.head = {
                                        data: res,
                                        type: "json"
                                     }
                                    sails.once("hook:orm:reloaded", () => {
                                        console.log("alter:hook:orm:reloaded")  
                                      resolve(state);
                                    })        
                                } catch (e) {
                                    reject(new DDLAlterImplError(e.toString())) 
                                }                
                            })             
                    } catch (e) {
                        reject(new DDLAlterImplError(e.toString())) 
                    }        
                })         
        })
    },

    help: {
        synopsis: "Create new entity collection",
        name: {
            "default": "ddl.create",
            synonims: ["ddl.entity"]
        },
        input: ["waterline model description"],
        output: "json",
        "default param": "model",
        params: [{
            name: "model",
            synopsis: "Collection name. Retuns all definitions when collection name is undefined",
            type: ["string"],
            synonims: ["model", "for"],
            "default value": "undefined"
        }],
        example: {
            description: "Get Definition for All Stored Collections",
            code: "def()"
        }

    }
}
