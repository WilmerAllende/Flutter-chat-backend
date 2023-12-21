const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');
const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');


// Mensajes de Sockets
io.on('connection', async (client) => {
    console.log('Cliente conectado');

    // cliente con jwt
    const [valido, uid] = comprobarJWT(client.handshake.headers["x-token"]);
    if(!valido){
        return client.disconnect();
    }
    //Cliente autenticado
    await usuarioConectado(uid);

    // Ingresar al usuario a una sala específica
    // sala global - viene pro defecto

    client.join(uid);

    // Escuchar del cliente el mensaje personal
    client.on("mensaje-personal", async (payload) => {

        // grabar mensaje
        await grabarMensaje(payload);
        //console.log(payload);
        //io.emit( 'mensaje-personal', payload );
        io.to(payload.para).emit("mensaje-personal", payload);
    });

    





    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });

    /*client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    });*/


});
