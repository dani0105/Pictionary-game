# Carpeta de templates

Esta carpeta contendrá los template que va a requerir ir el servidor. Por lo general los template son archivos de para un motor de templates, lo que permite generar código html dinámico. Estos archivos llegan a ser muy útil para el envío de correos.

## Creación de templates

Para poder crear un template y mantener el estándar propuesto en este proyecto es el siguiente:

```
nombre.template.js
```

Dentro del archivo el código mínimo requerido sería:

```
html
    head
        meta( content='text/html; charset=UTF-8')
        title= Template
        meta(
            name="viewport",
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalabel=no",
        )
    body
        h1
            | ejemplo de template

```

**Nota**:Esta estructura puede variar y crearse de diferente manera, ya que varia segun el motor de template que se usa .


## Adición al archivo index

El archivo index.js se encarga de importar todos los template y dar un solo punto de importación para el resto de la aplicación. Para poder agregar una nueva ruta en el archivo index es necesario importarlo en el con: 
```
    const NombreTemplate = pug.compileFile('src/template/nombre.template.pug');
```
y agregarlo al export con:
```
    module.exports = {
        ...
        NombreTemplate,
        ...
    };
```
