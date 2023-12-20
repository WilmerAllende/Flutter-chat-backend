
const { response } = require("express");

const bcrypt = require("bcryptjs");

const { Usuario } = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");


const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;
    try {
        const existeEmail = await Usuario.findOne( { email: email} );
        if(existeEmail){
             res.status(400).json({
                ok: false,
                msg: "El correo ya está registrado"
            });
        }
        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar mi JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            body: usuario,
            token,
            msg: "Crear usuario!!!!"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }

    
}


const login = async (req, res = response) => {

    const { email, password } = req.body;
    try {
        const usuarioDB = await Usuario.findOne( { email: email} );
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: "Email no encontrado"
            });
        }

        // Validar password
        const validPassword = bcrypt.compareSync(password,usuarioDB.password);
        if(! validPassword){
            return res.status(400).json({
                ok: false,
                msg: "La contraseña no es válida"
            });
        }

        // Generar JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }

    
}



const renewToken = async (req, res = response) => {

    // const { email, password } = req.body;
    // req.uid
    const uid = req.uid;
    const token = await generarJWT(uid);
    const usuario = await Usuario.findById( uid );


    try {

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }

    
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}