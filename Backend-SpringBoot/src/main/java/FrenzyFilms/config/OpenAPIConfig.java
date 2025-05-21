package FrenzyFilms.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/**
 * Clase de configuración para Swagger/OpenAPI.
 *
 * Esta clase se encarga exclusivamente de definir la configuración necesaria
 * para habilitar la autenticación por tokens JWT (Bearer tokens) en Swagger UI.
 *
 * Al incluir esta clase en el proyecto, Swagger mostrará un botón "Authorize"
 * que permite al usuario introducir un token JWT para autenticar las peticiones
 * a los endpoints que requieren autorización.
 *
 * Configuración incluida:
 * - Definición del esquema de seguridad 'bearerAuth' de tipo HTTP Bearer.
 * - Aplicación global del esquema de seguridad a toda la documentación.
 *
 * Swagger incluirá automáticamente el token como:
 * Authorization: Bearer {token}
 */
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "FrenzyFilms API",
        version = "1.0",
        description = "Documentación de la API de FrenzyFilms"
    ),
    security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
public class OpenAPIConfig {
    // Esta clase no contiene lógica adicional.
    // Su único propósito es configurar la seguridad de Swagger.
}
