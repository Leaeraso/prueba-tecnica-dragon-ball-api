✅ Utilización de JWT para proteger rutas, pero sin implementación de gestión de usuario y al firmarlo se usa una constante en vez de una variable de entorno.
✅ Middleware de validación de token asigna a req.user un objeto vacio (el body del jwt) que igualmente no se usa en ningun otro lado.

```
async authenticateUser(user: UserDto) {
    if (!user.email || !user.username) {
      throw new BadRequestError(ErrorMessagesKeys.MISSING_DATA_USER);
    }

    const token = jwt.sign({ user }, config.SECRET_KEY!, { expiresIn: '1d' });
    return {
      token: token,
    };
  }
```

Ahora se utiliza una variable de entorno y se pide el email y username para firmar el token para luego guardarlo en el req.user.

---

✅ Manejo de errores, esta bueno que extiende de errores pero no hay un lugar donde esten todos los existentes, y se podría responder de distintas maneras para un mismo error porque se pasa el string del error en el constructor, se podría haber usado un json, por ejemplo, que guarde el mensaje.

```
export class BaseError extends Error {
  public statusCode: number;
  public error: string;

  constructor(key: ErrorMessagesKeys) {
    const { error, message, statusCode } = errorMessages[key];
    super(message);
    this.error = error;
    this.message = message;
    this.statusCode = statusCode;
  }
}
```

Se creo un JSON con todos los errores que pueden haber y una clase Base de la cual extienden los posibles errores como BadRequest, NotFound, etc. De esta manera se evitan los mensajes peronsalizados de tipo string, evitando duplicidad e inconsistencias.

---

✅ Dtos en UpperCammelCase.
✅ Gender enum typo, Feale en vez de Female.
✅ Typado de validateData, usar genericos para el Model y Record<string, any> para el data.

```
const validateData = async <T extends Document>(
  data: Record<string, any>,
  model: Model<T>
) => {...}
```

---

✅ parseKi debería estar en un archivo de utils, el if del match debería returnar nulo si no existe para que haya el menor código dentro del if y hacerlo mas legible.

```
const parseKi = (ki: string): number | null => {
  const normalizedKi = ki.toLowerCase().replace(/[,.]/g, '');

  if (!isNaN(Number(normalizedKi))) {
    return Number(normalizedKi);
  }

  const match = normalizedKi.match(/^([\d\.]+)\s*([a-zA-Z]+)$/);
  if (!match) {
    return null;
  }

  const numberPart = parseFloat(match[1]);
  const suffix = match[2] as keyof typeof SuffixesEnum;

  if (!SuffixesEnum[suffix]) {
    return null;
  }
  return numberPart * SuffixesEnum[suffix];
};
```

---

# getAndSaveCharacters

✅ Error en la línea 61 de character.service.ts no esta en el archivo de errores.
✅ Si tiras un error ahí podrías perder todo el procesado de previos personajes obtenidos, se debería intentar recuperar de este error.
✅ al normalizar los personajes, volves a normalizar los que ya habias normalizado previamente, sería mucho mas eficiente normalizarlos todos despues de haberlos obtenido, podrias haberlos normalizado en el primer map tambien.
✅ Lo arreglaste, pero ahora haces un for await uno por uno, esto debería hacerse en tandas de 10 personajes, mas o menos, con un Promise.allSettled().

```
  async fetchCharacters() {...}
  async saveCharactersInBatches(characters: CharacterDto[]) {...}
  async getAndSaveCharacters() {
    const characters = await this.fetchCharacters();

    if (!characters)
      throw new BadRequestError(ErrorMessagesKeys.ERROR_OBTAINING_CHARACTERS);

    await this.saveCharactersInBatches(characters);

    return { message: 'Data obtained and saved successfully' };
  }
```

Se dividio la funcion getAndSaveCharacters en 3 partes:
1° Se obtienen los personajes de la API externa y se normalizan.
2° Se guardan los personajes en la DB en batches de 10 personajes, se arreglan los character_number respetando el orden y autoincremento de la DB (relacionado con el punto de sobreescritura de personajes al hacer un post y luego un fetch).
3° Utilización de las funciones anteriores para completar el fetch y la escritura en la DB.

---

⏸️ Esto es una recomendación, el cliente realmente no necesita esperar por una respuesta, se podría haber respondido con un job_id y despues un endpoint para consultar el status de ese job (processing, success, error).
⏸️ Otra recomendación seria hacer una función lo que hay en el while, y como extra, creo que es un buen caso para usar un worker pool, https://nodejs.org/api/worker_threads.html

TRABAJANDO EN ESTO...

---

# getCharacters

✅ El uso de la cache esta mal hecho, si la query es distinta porq usa algun filtro o el paginado mismo, te va a responder con los mismos personajes. La key de la cache debería tener los parametros de la query.

```
const cacheKey = `characters:${JSON.stringify(queryParams)}`;

const reply = await client.get(cacheKey);
if (reply) return JSON.parse(reply);

await client.setEx(cacheKey, 600, JSON.stringify(characters));

```

Se utiliza una clave dinamica para guardar las peticiones en la cache, asi se respetan los filtros utlizados.

---

✅ getCharacterById, affiliate?????
✅ Se repite la query de los personajes (en el exportar por excel y el buscarlos), se debería crear una funcion que lo devuelva para reutilizar y evitar problemas futuros.

```
queryParams.page_size = await CharacterModel.countDocuments();
const characters = await this.getCharacters(queryParams);
```

---

✅ Crear personaje, si creo una y despues fetcheo mi personaje va a ser sobrescrito.

Ahora al crear un personaje y luego fetchear personajes con la API externa se respeta y ajustan los character_number de los personajes para evitar sobreescrituras en el metodo SaveCharactersInBatches().

---

✅ Util de Paginación, añadir defaults para los parametros.
✅ Ademas la lógica de ki_min ki_max no debería estar aca, la función deberia ser generica para poder ser usada por otros servicios.

```
export interface GeneralSearchDtoWithKiFilters extends GeneralSearchDto {
  ki_min?: number;
  ki_max?: number;
}
```

---

✅ Es innecesario el wrapeo del retorno en un objeto.
✅ Middleware de validacion de token, el error respondido tampoco esta en el archivo de errores.
✅ Swagger, la ruta de fetch-characters-data tiene un typo y no funciona.

# Siguientes mejoras

- Utilizar un aggregate en el getCharacters para matchear a todos los personajes posbiles y no tener que buscar el nombre completo.

- Agregar una coleccion en la DB para almacenar los character_number eliminados y evitar inconsistencias.
