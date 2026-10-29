# Visualizador de instituciones de debate

Página estática que lee en directo la pestaña **LISTA** de la hoja
[INSTITUCIONES DEBATE - OFICIAL 2026](https://docs.google.com/spreadsheets/d/1jHHocz9bU08hneWSSyNR3Y0dHkfdNYTaemagSTJ4PGg/edit)
y un **buzón** para que cualquiera envíe propuestas de cambio, que llegan a una
pestaña **Propuestas** de esa misma hoja.

- No hay copia de los datos: cada visita (y cada 5 minutos con la página abierta) lee la hoja. Si editas la hoja, la web cambia sola.
- Las propuestas **nunca** modifican LISTA. Entran como filas "Pendiente" y tú decides.
- Marca avisos automáticos por fila: código repetido, sin país o país «PENDIENTE», sin institución, espacios sobrantes o caracteres invisibles.
- Las estadísticas (totales, % verificados y escolares, registros por país) se calculan en la página a partir de LISTA y siguen los filtros activos. La hoja no necesita pestañas de estadísticas.
- El botón **Copiar para Tabbycat** copia «Institución, Siglas del club», una línea por registro mostrado, para importar instituciones en Tabbycat (sustituye a la antigua pestaña «Formato para Tab»).

## Diseño

Sigue el estilo de [cmudebarcelona.org](https://cmudebarcelona.org/): tipografías Outfit y
Playfair Display, cabecera fija, portada oscura, botones redondeados e iconos Font Awesome 6.4.
Los colores están en variables al principio de `index.html` (`--color-primary`,
`--color-secondary`, `--color-dark`…); son aproximados hasta copiar los de su `styles.css`.

Logo: sube el SVG del panot como `logo.svg` en la raíz del repo y aparecerá en la cabecera.
Mientras no exista, se muestra un icono provisional.

Contacto público: `barcelona@cmudebarcelona.org` (cabecera, bloque de contacto, pie y buzón).

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | El visualizador y el formulario del buzón. |
| `config.js` | ID de la hoja, pestaña, URL del buzón y frecuencia de recarga. |
| `apps-script/Code.gs` | Código del buzón, para pegar en Apps Script de la hoja. |

## 1. Lectura de la hoja

La web intenta dos vías, en este orden:

1. **Lectura directa**, si la hoja está compartida como "Cualquier persona con el enlace: Lector".
2. **A través del Apps Script del buzón** (`?accion=lista`), que se ejecuta como propietario
   y solo devuelve la pestaña LISTA. Funciona con la hoja **privada**.

Recomendado: la segunda. Si la hoja es pública, también lo es la pestaña Propuestas,
con los nombres y emails de quien envía propuestas.

## 2. Activar el buzón

1. En la hoja: **Extensiones → Apps Script**.
2. Borra el contenido de `Código.gs` y pega `apps-script/Code.gs`. Guarda.
3. **Implementar → Nueva implementación** → tipo **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier usuario**.
4. Autoriza los permisos (hoja y envío de correo) y copia la URL que termina en `/exec`.
5. Pégala en `config.js` → `PROPOSALS_URL` y publica el cambio.

La pestaña **Propuestas** se crea sola con la primera propuesta. Cada una te llega
también por correo (desactívalo con `NOTIFY_BY_EMAIL = false` en el script).

Si cambias el script más adelante: **Implementar → Gestionar implementaciones → lápiz (editar) →
Versión: Nueva versión → Implementar**, para conservar la misma URL. Guardar el código no basta:
la URL `/exec` sigue sirviendo la versión anterior hasta que implementas una nueva.

## 3. Publicar la web (GitHub Pages)

Settings → Pages → *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
También funciona abriendo `index.html` en local o en cualquier hosting estático.

## Limitaciones conocidas

- El buzón es público: tiene un campo trampa contra bots y neutraliza fórmulas, pero
  no impide que una persona envíe propuestas basura. Por eso nada se aplica sin revisión.
- La API de lectura de Google decide el tipo de cada columna por mayoría; si una
  columna mezcla números y texto, los valores minoritarios pueden verse vacíos.
  Con los datos actuales (todo texto y casillas) no ocurre.
