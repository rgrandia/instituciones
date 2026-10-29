// Configuración del visualizador. Es lo único que hay que tocar.
window.CONFIG = {
  // ID de la hoja de Google (lo que va entre /d/ y /edit en la URL).
  SHEET_ID: "1jHHocz9bU08hneWSSyNR3Y0dHkfdNYTaemagSTJ4PGg",
  // Pestaña que se muestra.
  SHEET_NAME: "LISTA",
  // URL de la aplicación web de Apps Script (termina en /exec).
  // Mientras esté vacía, el buzón no envía nada y lo indica en pantalla.
  PROPOSALS_URL: "https://script.google.com/macros/s/AKfycbw79NgLNqmP8g9hvZxvd2BkbnGrCRqv7OtN1JoT_3sV0joNiSJHj8EFA192jPYqxjIs/exec",
  // Cada cuántos minutos se vuelve a leer la hoja con la página abierta.
  REFRESH_MINUTES: 5,
};
