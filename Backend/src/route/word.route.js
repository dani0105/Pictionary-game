const router        = require('express').Router();
const HttpStatus    = require('http-status-codes').StatusCodes;
const controller    = require('../controller/index').WordController;

/**
 *  End point insertar palabras en el sistema
 */
router.post('/word', (req, res, next) => {
    controller.add_word(req.body, res, next).then(result => {
        res.status(HttpStatus.OK).json(result);
    }).catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("error");
    })
});

/**
 *  End point para conseguir palabras nuevas 
 */
router.get('/word', (req, res, next) => {
    controller.get_word(req.query, res, next).then(result => {
        res.status(HttpStatus.OK).json(result);
    }).catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json("error");
    })
});

module.exports = router;