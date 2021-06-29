# Carpeta de controladores

Esta carpeta contendrá los controladores que va a requerir ir el servidor. Por lo general los controladores se encargan de obtener datos de la base de datos, además de procesarlo para facilitar su uso a nivel de front-end.

## Creación de controladores

Para poder crear un controlador y mantener el estándar propuesto en este proyecto es el siguiente:
```
nombre.controller.js
```
Dentro del archivo el código mínimo requerido sería:
```
exports.nombreFuncion = async (parametros) => {
    //Contenido de la función 
}

module.exports
```
## Adición al archivo index

El archivo index.js se encarga de importar todos los middlewares y dar un solo punto de importación para el resto de la aplicación. Para poder agregar un nuevo controlador en el archivo index es necesario importarlo en el con: 
```
    const NombreController = require('path/to/controller');
```
y agregarlo al export con:
```
    module.exports = {
        ...
        NombreController,
        ...
    };
```
