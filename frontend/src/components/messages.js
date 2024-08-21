//export para que puedan ser exportadas y utilizadas en otro archivo del mismo directorio
//mensajes de éxito
export function showSuccessMessage(message) {
    var successDiv = document.getElementById('message-success');
    var successMessage = document.getElementById('success-message');
    successMessage.textContent = message;
    successDiv.style.display = 'block';
    // Ocultar el mensaje después de 5 segundos (5000 milisegundos)
    setTimeout(function() {
        successDiv.style.display = 'none';
    }, 5000);
}

//mensajes de error
export function showErrorMessage(message) {
    var errorDiv = document.getElementById('message-error');
    var errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorDiv.style.display = 'block';
    // Ocultar el mensaje después de 5 segundos (5000 milisegundos)
    setTimeout(function() {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Función para cerrar un mensaje manualmente
export function closeMessage(messageId) {
    var messageDiv = document.getElementById(messageId);
    messageDiv.style.display = 'none';
}

// Luego, puedes llamar a estas funciones en tu código JavaScript según sea necesario para mostrar mensajes dinámicos.
// Por ejemplo:
// showSuccessMessage("¡Operación exitosa!");
// showErrorMessage("Ha ocurrido un error al procesar la solicitud.");