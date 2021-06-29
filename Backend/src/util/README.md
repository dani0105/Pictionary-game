# Carpeta de útiles

Esta carpeta contendrá los útiles que va a requerir ir el servidor. Por lo general los útiles se encargan de tareas pequeñas y específicas que se utilizan en múltiples puntos de la aplicación.

## Creación de útiles

Para poder crear un útil y mantener el estándar propuesto en este proyecto es el siguiente:
```
nombre.util.js
```
Dentro del archivo el código mínimo requerido sería:
```
exports.nombreFuncion = async (parametros) => {
    //Contenido de la funcion 
}

module.exports
```
## Adición al archivo index

El archivo index.js se encarga de importar todos los útiles y dar un solo punto de importación para el resto de la aplicación. Para poder agregar un nuevo controlador en el archivo index es necesario importarlo en el con: 
```
    const NombreUtil = require('path/to/util');
```
y agregarlo al export con:
```
    module.exports = {
        ...
        NombreUtil,
        ...
    };
```
