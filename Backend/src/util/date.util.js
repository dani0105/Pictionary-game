// Funcion basica que formate un feha de la forma "22 de mayo de 2021"
exports.formatDate = (date) => {
    if(date)
        return date.toLocaleString('defaul',{month:'long',day:'numeric',year:'numeric'});
    return "Sin Fecha"
}

module.exports