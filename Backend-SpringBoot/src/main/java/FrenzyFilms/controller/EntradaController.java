
package FrenzyFilms.controller;

import FrenzyFilms.dto.EntradaDetalladaPlanoDTO;
import FrenzyFilms.entity.Entrada;
import FrenzyFilms.service.EntradaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/entrada")
@Tag(name = "Entrada", description = "Operaciones relacionadas con las entradas de cine")
public class EntradaController {

    @Autowired
    private EntradaService entradaService;

    @GetMapping("/usuario")
    @Operation(summary = "Obtener todas las entradas del usuario logueado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Entradas obtenidas correctamente"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<Set<Entrada>> getAllEntradasByUsuario() {
        Set<Entrada> entradas = entradaService.getAllEntradasByUsuario();
        return ResponseEntity.ok(entradas);
    }

    @GetMapping("/usuario/detallado")
    @Operation(summary = "Obtener todas las entradas del usuario logueado, con detalles completos de sesión, sala y película")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Entradas detalladas obtenidas correctamente"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado si no estás autenticado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<List<EntradaDetalladaPlanoDTO>> getEntradasDetalladas() {
        List<EntradaDetalladaPlanoDTO> resultado = entradaService.getEntradasDetalladas();
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/sesion/{idSesion}")
    @Operation(summary = "Obtener todas las sesiones por película", description = "Devuelve todas las entradas asociadas a una sesión específica. Solo accesible por administradores.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sesiones encontradas"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado"),
            @ApiResponse(responseCode = "404", description = "Película no encontrada")
    })
    public ResponseEntity<Set<Entrada>> getSesionesByPelicula(@PathVariable int idSesion) {
        Set<Entrada> entradas = entradaService.getAllEntradasBySesion(idSesion);
        return ResponseEntity.ok(entradas);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una entrada por ID (solo si es del usuario o es admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Entrada encontrada"),
            @ApiResponse(responseCode = "404", description = "Entrada no encontrada o acceso denegado")
    })
    public ResponseEntity<Entrada> getEntradaById(@PathVariable int id) {
        Entrada entrada = entradaService.getEntradaById(id);
        return ResponseEntity.ok(entrada);
    }

    @PostMapping("/{idSesion}")
    @Operation(summary = "Crear una nueva entrada para una sesión")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Entrada creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Error al crear entrada (asiento ocupado, sesión empezada, sin asientos)")
    })
    public ResponseEntity<Entrada> createEntrada(
            @PathVariable int idSesion,
            @RequestBody Entrada entrada) {
        Entrada nueva = entradaService.createEntrada(entrada, idSesion);
        return ResponseEntity.ok(nueva);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una entrada (si eres admin o el propietario)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Entrada cancelada correctamente"),
            @ApiResponse(responseCode = "403", description = "No tienes permiso para cancelar la entrada"),
            @ApiResponse(responseCode = "400", description = "No se puede cancelar con menos de 1 hora")
    })
    public ResponseEntity<Void> deleteEntrada(@PathVariable int id) {
        entradaService.deleteEntrada(id);
        return ResponseEntity.ok().build();
    }
}
