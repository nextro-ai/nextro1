# Sala de revisión: portal de aprobación de videos

Página donde el cliente mira la pieza, pausa y deja comentarios **pegados al segundo exacto**, cambia entre versiones (v1, v2…) y **aprueba o pide cambios**. Todo con la marca de LonsoLab, en tu dominio (por ejemplo `revision.lonsolab.com`) y con los datos en tu propia cuenta de Google.

- `web/`: la página (un solo `index.html`, sin compilar), `config.js` y una carpeta por proyecto en `web/proyectos/<proyecto>/` con `proyecto.json` y los videos. En este repo solo está el proyecto `demo`.
- `backend/`: Apps Script que guarda comentarios y decisiones en una planilla y te avisa por mail.
- `scripts/nueva_version.py`: prepara un video para revisar (copia liviana, inicio rápido, póster, sin metadatos como la ubicación) y lo suma como nueva versión, sin pisar las anteriores.
- `scripts/comentarios.py`: trae los comentarios pendientes, ordenados por segundo, para pasarlos a la lista de cambios.

Sin `endpoint` en `config.js`, la página funciona en **modo demo**: los comentarios quedan solo en el navegador de quien la abre. Sirve para mostrarla, no para clientes.

> **Este repo es público.** Los videos de clientes, el `config.js` con la URL del backend y los links con clave van en una copia de `web/` fuera del repo (la **carpeta de publicación**), nunca en un commit. `nueva_version.py` no guarda proyectos de clientes dentro del repo.

## Instalación (una sola vez, unos 30 minutos)

Necesitás la cuenta de Google de LonsoLab (una de Gmail sirve), la cuenta de Cloudflare, Python 3 y ffmpeg (Mac: `brew install ffmpeg` · Ubuntu: `sudo apt install ffmpeg` · Windows: `winget install ffmpeg`).

### 1. Planilla y backend

1. Creá una planilla nueva en la cuenta de Google de LonsoLab, por ejemplo "Sala de revisión · Comentarios".
2. En la planilla: *Extensiones > Apps Script*. Arriba a la izquierda, cambiá "Proyecto sin título" por "Sala de revisión" (es el nombre que aparece al pedir permisos). En `Código.gs`, borrá lo que hay y pegá todo `backend/Code.gs`.
3. En la barra de la izquierda, *Configuración del proyecto* (el engranaje): tildá **Mostrar el archivo de manifiesto "appsscript.json" en el editor**. Volvé al *Editor* (`< >`), abrí `appsscript.json`, reemplazá todo por `backend/appsscript.json` y guardá (Ctrl+S o Cmd+S).
4. Volvé a la planilla y recargala. A los pocos segundos aparece el menú **Sala de revisión**: elegí **Preparar la planilla**. La primera vez Google pide autorización:
   - *Revisar permisos* y elegí la cuenta de LonsoLab.
   - "Google no verificó esta app" es normal en un script propio: *Configuración avanzada > Ir a Sala de revisión (no seguro)*.
   - Si aparecen casillas, marcá todas (*Seleccionar todo*) y *Continuar*. Si destildás alguna, el sistema falla. Lo que pide:
     - ver y editar **solo esta planilla** (no el resto del Drive);
     - enviar correos en tu nombre (los avisos de comentarios y aprobaciones);
     - mostrar cuadros dentro de la planilla (el menú y "Nuevo proyecto…");
     - ver tu dirección de correo (para mandarte los avisos).

   Se crean las hojas Proyectos, Comentarios y Decisiones.
5. En Apps Script, botón azul **Implementar > Nueva implementación**. En *Seleccionar tipo* (engranaje) elegí **Aplicación web** y completá:
   - *Descripción*: "Sala de revisión".
   - *Ejecutar como*: **Yo**.
   - *Quién tiene acceso*: **Cualquier usuario**. No "Cualquier usuario con una Cuenta de Google": con esa, al cliente le pide iniciar sesión y la página no puede guardar. Si la opción no aparece, la cuenta es de Google Workspace con restricciones: usá una de Gmail o pedile al administrador que la habilite.

   *Implementar* y copiá la **URL de la aplicación web**, la que termina en `/exec`. La que termina en `/dev` (*Implementaciones de prueba*) pide tu sesión: no sirve para clientes ni para `comentarios.py`.
6. Si la página no va a estar en `revision.lonsolab.com`, cambiá `URL_PORTAL` al principio de `Código.gs` (con eso arma el link de cada proyecto) y actualizá la implementación (ver [Actualizar](#actualizar)).

### 2. Carpeta de publicación (fuera de este repo)

1. Copiá `herramientas/portal-aprobacion/web/` a una carpeta fuera del repo, por ejemplo `~/LonsoLab/sala-revision-web/`. Ahí viven el `config.js` con la URL y los proyectos de clientes. Si la querés versionar, que sea en un repo **privado**.
2. En la copia: pegá la URL `/exec` en `config.js`, en `endpoint`, y borrá `proyectos/demo` (con `endpoint` ya no funciona como demo).
3. Decile a `nueva_version.py` dónde está la copia: sumá esta línea a tu `~/.zshrc` o `~/.bashrc` (o pasá `--web <carpeta>` cada vez).
   ```bash
   export SALA_REVISION_WEB=~/LonsoLab/sala-revision-web
   ```

### 3. Cloudflare Pages

1. En el panel de Cloudflare: *Workers & Pages > Crear* (Create), pestaña **Pages** > **Subir recursos** (Upload assets). Si solo ves opciones de Workers, abajo está el enlace a Pages ("Looking to deploy Pages? Get started").
2. Nombre del proyecto: `sala-revision` > *Crear proyecto* > arrastrá la **carpeta de publicación completa** > *Implementar sitio* (Deploy site). Queda en `https://sala-revision.pages.dev`.
3. En el proyecto, *Dominios personalizados* (Custom domains) > *Configurar un dominio* > `revision.lonsolab.com` > *Activar*. Si `lonsolab.com` usa los DNS de Cloudflare, el registro se crea solo; si no, agregá en tu proveedor un CNAME `revision` → `sala-revision.pages.dev` (después de este paso, no antes). Tarda unos minutos.

Desde la terminal también se puede (la primera vez, `npx wrangler login`):
```bash
npx wrangler pages deploy ~/LonsoLab/sala-revision-web --project-name sala-revision
```
Si la carpeta de publicación es un repo git, wrangler usa la rama actual y, si no es la de producción, publica solo una vista previa: agregá `--branch main` (o la rama de producción que figura en la configuración del proyecto).

**Cada publicación reemplaza el sitio entero:** subí siempre la carpeta completa, no solo el proyecto nuevo.

Cloudflare Pages acepta archivos de hasta 25 MB. `nueva_version.py` comprime el video para que entre (si hace falta, baja a 720 px). Si una pieza larga igual no entra, subila a un almacenamiento aparte con acceso público (por ejemplo un bucket de R2) y en `proyecto.json` poné la URL completa `https://…` en `archivo`.

## Cada proyecto nuevo

1. En la planilla: **Sala de revisión > Nuevo proyecto…** Pide un nombre corto (por ejemplo `reel-octubre`) y el cliente, y te da el **identificador** y el link con su clave: `https://revision.lonsolab.com/?p=reel-octubre-3f9a1c&k=xxxxxxxxxxxx`.
   - El identificador termina solo en 6 caracteres al azar (`-3f9a1c`): la clave protege comentar y aprobar, pero los videos son archivos públicos, y así nadie adivina `revision.lonsolab.com/proyectos/<identificador>/v1.mp4`.
   - En la hoja Proyectos, `aviso_email` es el mail que recibe los avisos (por defecto, el tuyo).
2. Subí el video (MP4, MOV, etc., vertical u horizontal, con o sin audio):
   ```bash
   python3 herramientas/portal-aprobacion/scripts/nueva_version.py reel-octubre-3f9a1c render.mp4 --pieza "Reel · Promo de octubre" --cliente "Panadería Ejemplo" --entrega 2026-10-15
   ```
   `--pieza` es el título que ve el cliente, `--cliente` aparece como "Para …" y `--entrega` (AAAA-MM-DD) como fecha de entrega. El identificador tiene que ser **igual** al de la planilla: si no, el cliente ve el video pero no puede comentar.
3. Volvé a publicar la carpeta de publicación y mandale el link al cliente por WhatsApp.

## Cuando el cliente comenta

1. Te llega un mail: como mucho uno cada 10 minutos por proyecto con comentarios nuevos, y uno por cada aprobación o pedido de cambios (si se repite la misma decisión en esos 10 minutos, no vuelve a avisar). Si el cupo diario de mails de Google está por agotarse, se pausan los avisos de comentarios para que siempre lleguen las decisiones.
2. Traé la lista:
   ```bash
   python3 herramientas/portal-aprobacion/scripts/comentarios.py "<URL /exec>" reel-octubre-3f9a1c <clave> --version v1
   ```
   Sin `--version` trae todas las versiones; `--todos` suma los ya resueltos; `--json` da la salida para otro programa.
3. Hacé los cambios (o pedíselos a Claude con la skill `portal-aprobacion`), subí la v2 con `nueva_version.py --nota "qué cambió"` (la nota la lee el cliente: escribila en su lenguaje), marcá como resueltos los comentarios que se atendieron y volvé a publicar. El cliente usa **el mismo link** y ve la versión nueva con la nota. `nueva_version.py` nunca pisa una versión: si borraste una del medio, la nueva sigue numerando desde la más alta.

## Actualizar

- **Backend** (cuando cambia `Code.gs`): pegá el código nuevo en `Código.gs` y guardá. Guardar no alcanza: la URL `/exec` sigue con la versión anterior hasta que hagas *Implementar > Administrar implementaciones*, elijas la implementación activa, toques el lápiz (*Editar*), en *Versión* elijas **Nueva versión** e *Implementar*. La URL no cambia. No uses *Nueva implementación*: crea otra URL y habría que cambiar `config.js`. Si el cambio suma columnas, corré otra vez *Sala de revisión > Preparar la planilla* (no pisa datos); si pide permisos de nuevo, aceptalos como la primera vez.
- **Página** (cuando cambia `index.html`): copiá el `index.html` nuevo a la carpeta de publicación, sin tocar `config.js` ni `proyectos/`, y volvé a publicar.
- **Volver a publicar** en Cloudflare: en el proyecto `sala-revision`, *Crear implementación* (Create deployment) y subí la carpeta de publicación completa, o usá el comando de `wrangler`.

## Si algo falla

- **El cliente ve el video pero no puede comentar:** el identificador o la clave no coinciden con la hoja Proyectos, `activo` dice `NO`, o el `config.js` publicado no tiene la URL `/exec` vigente.
- **`comentarios.py` dice que el backend devolvió una página web:** la URL es la de `/dev`, o *Quién tiene acceso* no es "Cualquier usuario".
- **Un cambio en el backend no se ve:** falta *Nueva versión* en *Administrar implementaciones*.
- **Errores del backend (`error_interno`):** en Apps Script, *Ejecuciones* muestra el detalle.

## Reglas

- El link con clave es privado: cualquiera que lo tenga puede comentar y aprobar. Si se filtra, en la hoja Proyectos poné `NO` en `activo` o cambiá la clave (y mandá el link nuevo).
- La planilla guarda solo lo que el cliente escribe y su nombre. No pidas otros datos personales.
- La página no muestra ninguna herramienta ni proveedor (marca blanca) y no se indexa en buscadores (`noindex`). Cuando el trabajo se entregó, podés borrar la carpeta del proyecto de la copia y volver a publicar.
- Los videos de demo (`web/proyectos/demo`) son del reel propio de LonsoLab.
- `web/_headers` le dice a Cloudflare Pages que la página no se puede mostrar dentro de otro sitio, que no se indexa y que no pasa la dirección (con la clave) a otros sitios. Se publica junto con el resto de la carpeta.
