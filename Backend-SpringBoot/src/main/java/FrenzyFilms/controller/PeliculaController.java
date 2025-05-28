
package FrenzyFilms.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import FrenzyFilms.entity.Estado;
import FrenzyFilms.entity.Pelicula;
import FrenzyFilms.entity.Sesion;
import FrenzyFilms.service.PeliculaService;
import FrenzyFilms.service.SesionService;

@RestController
@RequestMapping("/pelicula")
@Tag(name = "Película", description = "Operaciones relacionadas con la gestión de películas")
public class PeliculaController {

    @Autowired
    private PeliculaService peliculaService;

    @Autowired
    private SesionService sesionService;

    @GetMapping
    @Operation(summary = "Obtener todas las películas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de películas obtenida correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<List<Pelicula>> getAllPeliculas() {
        return ResponseEntity.ok(peliculaService.getAllPeliculas());
    }

    @GetMapping("/cartelera")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Películas obtenidas correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @Operation(summary = "Obtener las películas activas en cartelera")
    public ResponseEntity<List<Pelicula>> getPeliculasEnCartelera() {
        return ResponseEntity.ok(peliculaService.getPeliculasEnCartelera());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una película por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Película encontrada"),
            @ApiResponse(responseCode = "404", description = "Película no encontrada")
    })
    public ResponseEntity<Pelicula> getPeliculaById(@PathVariable int id) {
        Optional<Pelicula> pelicula = peliculaService.getPeliculaById(id);
        if (pelicula.isPresent()) {
            return ResponseEntity.ok(pelicula.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/sesion/{idSesion}")
    @Operation(summary = "Obtener la pelicula asociada a una entrada")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pelicula encontrada correctamente"),
            @ApiResponse(responseCode = "404", description = "Pelicula o sesion no encontrada")
    })
    public ResponseEntity<Pelicula> getPeliculaBySesion(@PathVariable int idSesion) {
        Optional<Sesion> sesionO = sesionService.getSesionById(idSesion);
        if (!sesionO.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Pelicula> peliculaO = peliculaService.findBySesion(sesionO.get());
        if (!peliculaO.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(peliculaO.get());
    }

    @PostMapping("/importar/{idTmdb}")
    @Operation(summary = "Importar una película desde TMDb")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Película importada correctamente"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado"),
            @ApiResponse(responseCode = "400", description = "La película ya existe o datos inválidos")
    })
    public ResponseEntity<Pelicula> importarPeliculaDesdeTmdb(@PathVariable int idTmdb) {
        Pelicula pelicula = peliculaService.importarDesdeTmdb(idTmdb);
        return ResponseEntity.ok(pelicula);
    }

    @PutMapping("/{id}/estado/{nuevoEstado}")
    @Operation(summary = "Actualizar el estado de una película", description = "Permite a un administrador cambiar el estado de una película existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estado actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Estado inválido o datos incorrectos"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado. Solo administradores."),
            @ApiResponse(responseCode = "404", description = "Película no encontrada")
    })
    public ResponseEntity<String> actualizarEstado(@PathVariable int id, @PathVariable Estado nuevoEstado) {
        peliculaService.actualizarEstado(id, nuevoEstado);
        return ResponseEntity.ok("Estado actualizado correctamente");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una película por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Película eliminada correctamente"),
            @ApiResponse(responseCode = "400", description = "No se puede eliminar la película")
    })
    public ResponseEntity<String> deletePelicula(@PathVariable int id) {
        if (peliculaService.deletePelicula(id)) {
            return ResponseEntity.status(HttpStatus.OK).body("Película eliminada correctamente");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Película no encontrada o tiene sesiones asociadas");
        }
    }
}
