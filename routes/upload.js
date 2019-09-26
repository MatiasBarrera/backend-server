// Rutas
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipo de coleccion
    var colecciones = ['hospitales', 'medicos', 'usuarios'];
    if (colecciones.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { message: 'Tipo de coleccion no es valida' }
        })
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        })
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.').pop();

    // var extencionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo esta extenciones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(nombreCortado) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Formato no valido',
            errors: { message: 'Las extensiones validas son: ' + extensionesValidas.join(', ') }
        })
    }

    // crear nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${nombreCortado}`;


    // mover archivo del temporal al path especifico
    var path = `./uploads/${ tipo }/${ nombreArchivo }`
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);



    })
});

subirPorTipo = (tipo, id, nombreArchivo, res) => {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            // finaliza ejecucion si ID no existe
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `No se encontro usuario con id: ${id}`,
                    errors: err
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe elimina imgaen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo, err => {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al eliminar path: ' + pathViejo,
                        errors: err
                    })
                });
            }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: `Error al actualizar imagen en la BD}`,
                        errors: err
                    });
                }

                usuarioActualizado.password = ':D';

                return res.status(200).json({
                    ok: true,
                    mensaje: `Imagen de usuario actualizado`,
                    usuarioActualizado: usuarioActualizado
                });

            })

        })

    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medicos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `No se encontro medico con id: ${id}`,
                    errors: err
                });
            }

            var pathViejo = './uploads/medicos/' + medicos.img;

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo, err => {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al eliminar path: ' + pathViejo,
                        errors: err
                    })
                });
            }

            medicos.img = nombreArchivo;
            medicos.save((err, medicosActualizar) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: `Error al actualizar imagen en la BD}`,
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: `Imagen del medico actualizado`,
                    medicosActualizar: medicosActualizar
                });
            })

        })

    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospitales) => {
            // finaliza ejecucion si ID no existe
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `No se encontro hospital con el id: ${id}`,
                    errors: err
                })
            }

            var pathViejo = './uploads/hospitales/' + hospitales.img;

            // Si existe elimina imgaen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo, err => {
                    return res.status(400).json({
                        ok: false,
                        mensaje: `Error al eliminar el path: ${pathViejo}`,
                        errors: err
                    })
                })
            }

            hospitales.img = nombreArchivo;
            hospitales.save((err, hospitalesActualizar) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: `Error al actualizar imagen en la BD}`,
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: `Imagen del medico actualizado`,
                    hospitalesActualizar: hospitalesActualizar
                });
            })

        })
    }
}

module.exports = app;