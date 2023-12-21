const { response } = require("express");
const { Mensaje } = require("../models/mensaje");

const obtenerChat  = async (req, res = response) => {
    try {
        const miId = req.uid;
        const mensajesDe = req.params.de;

        const last30 = await Mensaje.find({
            $or : [  { de: miId, para: mensajesDe} , { de: mensajesDe, para: miId }  ]
        })
        .sort({ createdAt: "desc" })
        .limit(30);


        /*const usuarios = await Mensaje
            .find({ _id: { $ne: req.uid } }) 
            .sort("-online")
            .skip(desde)
            .limit(20);*/

        res.json({
            ok: true,
            mensajes: last30
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
    obtenerChat
}