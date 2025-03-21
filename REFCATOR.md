✅ Utilización de JWT para proteger rutas, pero sin implementación de gestión de usuario y al firmarlo se usa una constante en vez de una variable de entorno.
✅ Middleware de validación de token asigna a req.user un objeto vacio (el body del jwt) que igualmente no se usa en ningun otro lado
✅ Manejo de errores, esta bueno que extiende de errores pero no hay un lugar donde esten todos los existentes, y se podría responder de distintas maneras para un mismo error porque se pasa el string del error en el constructor, se podría haber usado un json, por ejemplo, que guarde el mensaje.
✅ Dtos en UpperCammelCase
✅ Gender enum typo, Feale en vez de Female
✅ Typado de validateData, usar genericos para el Model y Record<string, any> para el data.
✅ parseKi debería estar en un archivo de utils, el if del match debería returnar nulo si no existe para que haya el menor código dentro del if y hacerlo mas legible.

# getAndSaveCharacters

✅ Error en la línea 61 de character.service.ts no esta en el archivo de errores y,
✅ Si tiras un error ahí podrías perder todo el procesado de previos personajes obtenidos, se debería intentar recuperar de este error.
✅ al normalizar los personajes, volves a normalizar los que ya habias normalizado previamente, sería mucho mas eficiente normalizarlos todos despues de haberlos obtenido, podrias haberlos normalizado en el primer map tambien.
✅ Lo arreglaste, pero ahora haces un for await uno por uno, esto debería hacerse en tandas de 10 personajes, mas o menos, con un Promise.allSettled()

- Esto es una recomendación, el cliente realmente no necesita esperar por una respuesta, se podría haber respondido con un job_id y despues un endpoint para consultar el status de ese job (processing, success, error).
- Otra recomendación seria hacer una función lo que hay en el while, y como extra, creo que es un buen caso para usar un worker pool, https://nodejs.org/api/worker_threads.html

# getCharacters

✅ El uso de la cache esta mal hecho, si la query es distinta porq usa algun filtro o el paginado mismo, te va a responder con los mismos personajes. La key de la cache debería tener los parametros de la query

✅ getCharacterById, affiliate?????

🛠️ Se repite la query de los personajes (en el exportar por excel y el buscarlos), se debería crear una funcion que lo devuelva para reutilizar y evitar problemas futuros.

- Crear personaje, si creo una y despues fetcheo mi personaje va a ser sobrescrito

✅ Util de Paginación, añadir defaults para los parametros
✅ Ademas la lógica de ki_min ki_max no debería estar aca, la función deberia ser generica para poder ser usada por otros servicios.

- Es innecesario el wrapeo del retorno en un objeto

✅ Middleware de validacion de token, el error respondido tampoco esta en el archivo de errores.

✅ Swagger, la ruta de fetch-characters-data tiene un typo y no funciona
