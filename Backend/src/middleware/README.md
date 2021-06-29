# Carpeta de middlewares

Esta carpeta contendrá los middlewares que va a requerir ir el servidor. Por lo general los middlewares son funciones que se ejecutan entre una ruta y un controlador, lo que permite hacer validaciones en las peticiones que se realizan. Un ejemplo básico de un middleware es el de verificación de tokens. 

## Creación de middlewares

Para poder crear un middleware y mantener el estándar propuesto en este proyecto es el siguiente:

```
nombre.middleware.js
```

Dentro del archivo el código mínimo requerido sería:

```
module.exports = () => {
    return (req, res, next) => {
        next();// esto permite seguir al controlador o al siguiente middleware
    }
}
```

**Nota**: Esta estructura puede variar y crearse de diferente manera.

## Adición al archivo index

El archivo index.js se encarga de importar todos los controladores y dar un solo punto de importación para el resto de la aplicación. Para poder agregar un nuevo middleware en el archivo index es necesario importarlo en el con: 
```
    const NombreMiddleware = require('path/to/middleware');
```
y agregarlo al export con:
```
    module.exports = {
        ...
        NombreMiddleware,
        ...
    };
```
