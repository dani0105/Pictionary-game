# Carpeta de routes

Esta carpeta contendrá los routes que va a requerir ir el servidor. Por lo general los routes son las rutas que van a existir en la aplicación, permitiendo definir el nombre y tipo de ruta 

## Creación de routes

Para poder crear un routes y mantener el estándar propuesto en este proyecto es el siguiente:

```
nombre.route.js
```

Dentro del archivo el código mínimo requerido sería:

```
const router        = require('express').Router();
const HttpStatus    = require('http-status-codes').StatusCodes;
const controller    = require('../controller/index').AppController;

router.get('/route', (req, res, next) => {

    controller.home(req.query, res, next).then(result => {
        res.status(HttpStatus.OK).json(result);
    }).catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("error");
    })

});

module.exports = router;
```

**Nota**: Esta estructura puede variar y crearse de diferente manera.


## Adición al archivo index

El archivo index.js se encarga de importar todos los routes y dar un solo punto de importación para el resto de la aplicación. Para poder agregar una nueva ruta en el archivo index es necesario importarlo en el con: 
```
    const NombreRoute = require('path/to/route');
```
y agregarlo al export con:
```
    module.exports = {
        ...
        NombreRoute,
        ...
    };
```
