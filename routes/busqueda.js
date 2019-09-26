// Rutas
var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medicos = require('../models/medico');
var Usuarios = require('../models/usuario');

// ======================================================
// Busqueda por coleccion
// ======================================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var colecciones = {
        hospital: buscarHospitales(regex),
        medico: buscarMedicos(regex),
        usuario: buscarUsuarios(regex)
    };

    if (colecciones[tabla] !== undefined) {
        colecciones[tabla].then(result => {
            res.status(200).json({
                ok: true,
                [tabla]: result
            });
        }).catch((err) => {
            return res.status(500).json({
                ok: false,
                message: `Error al buscar en la coleccion ${tabla}`,
                errors: err
            })
        });
    } else {
        res.status(400).json({
            ok: false,
            mensage: `La coleccion: ${tabla} no existe`
        });
    }
});
// ======================================================
// Busqueda general
// ======================================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(regex),
            buscarMedicos(regex),
            buscarUsuarios(regex)
        ])
        .then(
            respuestas => {
                res.status(200).json({
                    ok: true,
                    hospitales: respuestas[0],
                    medicos: respuestas[1],
                    usuarios: respuestas[2]
                });
            }
        ).catch(err => {
            res.status(500).json({
                ok: false,
                error: err
            })
        })
})

buscarHospitales = (regex) => {

    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombres email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales...', err);
                } else {
                    resolve(hospitales);
                }
            })
    })


}

buscarMedicos = (regex) => {

    return new Promise((resolve, reject) => {
        Medicos.find({ nombre: regex })
            .populate('usuario', 'nombres email')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar hospitales...', err);
                } else {
                    resolve(medicos);
                }
            })
    })


}

buscarUsuarios = (regex) => {

    return new Promise((resolve, reject) => {
        Usuarios.find({}, 'nombres email rol')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios... ', err)
                } else {
                    resolve(usuarios);
                }
            })
    })


}

module.exports = app;