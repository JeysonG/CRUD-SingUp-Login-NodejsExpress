module.exports = (nombrePunto) => {

    const self = {

        //Empaquetemos
        empaquetar: (frutas) => {
            return "Empaquetamos " + frutas + " para " + nombrePunto;
        },

        estadoProcesos: () => {
            
            let estados = {

                "empaquetar": self.estadoEmpaquetar(),
                "entregar": self.estadoEntregar()

            }

            return estados;

        },

        estadoEmpaquetar: () => {
            
            let estado = {

                "funciona": false,
                "descripcion": "Se jodio"

            }

            return estado;

        },

        estadoEntregar: () => {
            return true;
        }

    };

    return self;

}