# Prueba técnica Kairox- Dragon Ball API

Este ejercicio consta de construir una APIRest utilizando la arquitectura MVC, donde se consumira una API para guardar los personajes para luego hacer un CRUD con paginación, caché, etc.

<p>
Algunos de los puntos que se trabajaron:
</p>

- Consumo de API externa.
- Operaciones CRUD.
- Filtrado y paginación.
- Uso de ORM para consultas a la base de datos.
- Middlewares, caché, autenticación y validación de datos.
- Aquitectura MVC y Principios SOLID.
- Documentación y correcto uso de git.

---

### Tecnologias utilizadas

<ol>
<li>NodeJS con Express</li>
<li>Mongoose</li>
<li>TypeScript</li>
<li>Axios</li>
<li>Docker</li>
<li>JWT</li>
<li>Exceljs</li>
<li>Redis</li>
<li>Node mailer</li>
</ol>

**Entre otras...**

---

## Instalación y utilización

#### 1. Clonar el repositorio

```
git clone https://github.com/Leaeraso/prueba-tecnica-dragon-ball-api

```

#### 2. Instalar dependencias

```
npm install

```

#### 3. Configurar .env

**Explicación mas abajo**

#### 4. Iniciar el servidor

```
npm run start:dev

```

---

## Configuración de variables de entorno

### Variables de Entorno

| Variable               | Descripción                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| `HTTP_PORT`            | Puerto donde se ejecutará la API (por defecto, 3000).                 |
| `SECRET_KEY`           | Clave para firmar los tokens JWT.                                     |
| `MONGO_DB_URL`         | Url de la base de datos MongoDB.                                      |
| `FETCH_URI`            | Uri externa a consumir.                                                |
| `NODE_ENV `            | Entorno en el que se encuentra el proyecto.                           |
| `EMAIL`                | Dirección de correo para enviar mails.                                |
| `PASSPORD`             | Contraseña de aplicación asociada al correo.                          |
### Obtención de variables

#### 1. EMAIL_PASS(Contraseña de aplicación):

- Ir a la configuración de tu proveedor de email
- Activar la autenticación en dos pasos
- Generar una contraseña de aplicación

---

## Documentación

<p>
Para utilizar la documentación de la API y probar los endpoints, iniciar el servidor y entrar al siguiente endpoint:

```
http://localhost:3000/documentation/

```

</p>

---

## Licencia

<p>
Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

</p>
