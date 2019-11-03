var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//const SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();



var Usuario = require('../models/usuario');

// ======================================================
// Obtener los usuarios
// ======================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombres apellidoP img email role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    })
                }
                Usuario.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        usuarios: usuarios,

                    })
                })

            })
})

// ======================================================
// Actualizar usuario
// ======================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            })
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con el id ${id} no existe`,
                errors: { message: 'No existe un usaurio con ese ID' }
            });
        }

        usuario.nombres = body.nombres;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                })
            }
            usuarioGuardado.password = ':D';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            })
        })

    });
});

// ======================================================
// Crear un nuevo usuario
// ======================================================
app.post('/', (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombres: body.nombres,
        apellido: body.apellidoP,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        })
    });
});

// ======================================================
// Borrar un usuario por ID
// ======================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioRemove) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            })
        }

        if (!usuarioRemove) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con el id' + id,
                errors: { message: `No existe usuario con el id ${id}` }
            })
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioRemove
        })
    })
})

module.exports = app;