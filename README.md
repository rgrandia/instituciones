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

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | El visualizador y el formulario del buzón. |
| `config.js` | ID de la hoja, pestaña, URL del buzón y frecuencia de recarga. |
| `apps-script/Code.gs` | Código del buzón, para pegar en Apps Script de la hoja. |

## 1. Permitir la lectura de la hoja

La hoja tiene que estar compartida como **"Cualquier persona con el enlace: Lector"**
(Compartir → Acceso general). Si no, la web muestra un aviso y no carga datos.

Ojo: eso hace legible **todo el documento** (todas las pestañas) a quien tenga el ID,
que queda visible en el código de la página. Si alguna pestaña no debe ser pública,
muévela a otra hoja.

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

Si cambias el script más adelante: **Implementar → Gestionar implementaciones → editar →
Versión: nueva**, para conservar la misma URL.

## 3. Publicar la web (GitHub Pages)

Settings → Pages → *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
También funciona abriendo `index.html` en local o en cualquier hosting estático.

## Limitaciones conocidas

- El buzón es público: tiene un campo trampa contra bots y neutraliza fórmulas, pero
  no impide que una persona envíe propuestas basura. Por eso nada se aplica sin revisión.
- La API de lectura de Google decide el tipo de cada columna por mayoría; si una
  columna mezcla números y texto, los valores minoritarios pueden verse vacíos.
  Con los datos actuales (todo texto y casillas) no ocurre.
