package FrenzyFilms.error;

import jakarta.persistence.EntityNotFoundException;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleConflict(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor: " + ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException ex) {
        Map<String, String> response = new HashMap<>();

        if (ex.getRequiredType() != null && ex.getRequiredType().isEnum()) {
            response.put("error", "Valor inválido para el parámetro '" + ex.getName() + "'. Debe ser uno de: "
                    + Arrays.toString(ex.getRequiredType().getEnumConstants()));
        } else {
            response.put("error", "Parámetro inválido: " + ex.getName());
        }

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String rawMessage = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
        Map<String, String> response = new HashMap<>();

        if (rawMessage != null && rawMessage.contains("usuario_username_key")) {
            response.put("username", "Este nombre de usuario ya está en uso.");
        } else if (rawMessage != null && rawMessage.contains("usuario_email_key")) {
            response.put("email", "Este email ya está registrado.");
        } else if (rawMessage != null && rawMessage.contains("sala_num_sala_key")) {
            response.put("numSala", "Este numero de sala ya está registrado.");
        } else if (rawMessage != null && rawMessage.contains("pelicula_tmdb_id_key")) {
            response.put("tmdbId", "Esta película ya está registrada.");
        } else {
            response.put("error", "Error de integridad en los datos. Revisa que no estés duplicando información.");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUsernameNotFound(UsernameNotFoundException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Credenciales incorrectas. Verifica tu email y contraseña.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

}
