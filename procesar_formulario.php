<?php
// Verificar si se recibe POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

        // Capturar y sanitizar
        $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
        $nombre = filter_var(trim($_POST['nombre']), FILTER_SANITIZE_STRING);
        $telefono = filter_var(trim($_POST['telefono']), FILTER_SANITIZE_STRING);
        $acepta = isset($_POST['acepta']) ? 'Aceptado' : 'No aceptado';

        // Validar campos obligatorios
        if (empty($email) || empty($nombre) || empty($telefono)) {
            echo "Error: Todos los campos son obligatorios.";
            exit;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo "Error: El email no es válido.";
            exit;
        }

        // Email destino
        $to = "encomiendasmixco@gmail.com";
        $subject = "Nuevo Registro desde el Formulario";
        $message = "Se ha recibido un nuevo registro:\n\n";
        $message .= "Nombre y Apellidos: $nombre\n";
        $message .= "Email: $email\n";
        $message .= "Teléfono: $telefono\n";
        $message .= "Aceptación de Términos: $acepta\n";

        $headers = "From: noreply@tudominio.com\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        // Enviar email
        if (mail($to, $subject, $message, $headers)) {
            echo "Gracias por registrarte. Pronto nos pondremos en contacto.";
        } else {
            echo "Error: No se pudo enviar el correo. Intenta más tarde.";
        }
    } else {
    // Si no es POST, denegar acceso
    echo "Acceso denegado.";
}
?>
