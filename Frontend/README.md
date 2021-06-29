# **Frontend de Pictionary Game**
## Repositorio de la aplicación de pictionary
![alt](./src/assets/logo.gif)
## **Instalación** 
Para poder hacer uso de este proyecto es necesario tener instalado `Node` y tener un teléfono o emulador de `Android`. Para empezar, clone el repositorio con:

```bash
git clone https://github.com/dani0105/Pictionary-game.git
```

Una vez clonado proceda con la instalación de las librerías para el frontend y el backend necesarias para el correcto funcionamiento del proyecto con el comando:

```bash
npm install --save
```

Para poder ejecutar el frontend, conecte su teléfono `Android` al ordenador en el que descargo el repositorio e instalo las dependencias, seguido de eso, habilite el `modo desarrollador` de su teléfono. Por ultimo, en la carpeta del frontend ejecute el siguiente comando

```bash
npm run android
```

con eso empezará a compilar la aplicación. Además, es necesario tener ejecutando el backend, para hacerlo entre en la carpeta de `backend` y ejecute:

```bash
npm start
```

ya con eso tendría el backend y frontend en funcionamiento, lo último que necesitará es crear una carpeta envConfig.js en la raíz de la carpeta `frontend/src` y colocar en su contenido un código similar a este:

```javascript
var config = {
    production:true,
    ApiUrl: "http://localhost:8082/"
}

module.exports = config;
```