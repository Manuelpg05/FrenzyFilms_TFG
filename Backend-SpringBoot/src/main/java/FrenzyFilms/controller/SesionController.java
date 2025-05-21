
package FrenzyFilms.controller;

import FrenzyFilms.entity.Pelicula;
import FrenzyFilms.entity.Sala;
import FrenzyFilms.entity.Sesion;
import FrenzyFilms.service.PeliculaService;
import FrenzyFilms.service.SalaService;
import FrenzyFilms.service.SesionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/sesion")
@Tag(name = "Sesión", description = "Operaciones relacionadas con las sesiones de cine")
public class SesionController {

    @Autowired
    private SesionService sesionService;

    @Autowired
    private PeliculaService peliculaService;

    @Autowired
    private SalaService salaService;

    @GetMapping("/sala/{idSala}")
    @Operation(summary = "Obtener todas las sesiones por sala", description = "Devuelve todas las sesiones asociadas a una sala específica. Solo accesible por administradores.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sesiones encontradas"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado"),
            @ApiResponse(responseCode = "404", description = "Sala no encontrada")
    })
    public ResponseEntity<Set<Sesion>> getSesionesBySala(@PathVariable int idSala) {
        Set<Sesion> sesiones = sesionService.getAllSesionesBySala(idSala);
        return ResponseEntity.ok(sesiones);
    }

    @GetMapping("/pelicula/{idPelicula}")
    @Operation(summary = "Obtener todas las sesiones por película", description = "Devuelve todas las sesiones asociadas a una película específica. Solo accesible por administradores.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sesiones encontradas"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado"),
            @ApiResponse(responseCode = "404", description = "Película no encontrada")
    })
    public ResponseEntity<Set<Sesion>> getSesionesByPelicula(@PathVariable int idPelicula) {
        Set<Sesion> sesiones = sesionService.getAllSesionesByPelicula(idPelicula);
        return ResponseEntity.ok(sesiones);
    }

    @GetMapping("/futuras/pelicula/{idPelicula}")
    @Operation(summary = "Obtener sesiones futuras por película", description = "Devuelve únicamente las sesiones futuras asociadas a una película.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sesiones futuras encontradas"),
            @ApiResponse(responseCode = "404", description = "Película no encontrada")
    })
    public ResponseEntity<Set<Sesion>> getSesionesFuturasPorPelicula(@PathVariable int idPelicula) {
        Optional<Pelicula> pelicula = peliculaService.getPeliculaById(idPelicula);

        if (pelicula.isPresent()) {
            Set<Sesion> listaSesiones = pelicula.get().getSesiones();
            Set<Sesion> futuras = sesionService.getSesionesFuturas(listaSesiones);
            return ResponseEntity.ok(futuras);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/futuras/sala/{idSala}")
    @Operation(summary = "Obtener sesiones futuras por sala", description = "Devuelve únicamente las sesiones futuras asociadas a una sala.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sesiones futuras encontradas"),
            @ApiResponse(responseCode = "404", description = "Sala no encontrada")
    })
    public ResponseEntity<Set<Sesion>> getSesionesFuturasPorSala(@PathVariable int idSala) {
        Optional<Sala> sala = salaService.getSalaById(idSala);

        if (sala.isPresent()) {
            Set<Sesion> listaSesiones = sala.get().getSesiones();
            Set<Sesion> futuras = sesionService.getSesionesFuturas(listaSesiones);
            return ResponseEntity.ok(futuras);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una sesión por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sesión encontrada"),
            @ApiResponse(responseCode = "404", description = "Sesión no encontrada")
    })
    public ResponseEntity<Sesion> getSesionById(@PathVariable int id) {
        Optional<Sesion> sesion = sesionService.getSesionById(id);
        if (sesion.isPresent()) {
            return ResponseEntity.ok(sesion.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/P{idPelicula}/S{idSala}")
    @Operation(summary = "Crear una nueva sesión")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sesión creada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o conflicto de horario")
    })
    public ResponseEntity<Sesion> createSesion(
            @PathVariable int idPelicula,
            @PathVariable int idSala,
            @RequestBody Sesion nuevaSesion) {

        Sesion sesion = sesionService.createSesion(nuevaSesion, idPelicula, idSala);
        return ResponseEntity.ok(sesion);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una sesión existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sesión actualizada correctamente"),
            @ApiResponse(responseCode = "400", description = "No se puede modificar la sesión")
    })
    public ResponseEntity<Sesion> updateSesion(@PathVariable int id, @RequestBody Sesion sesionU) {
        sesionU.setId(id);
        Sesion actualizada = sesionService.updateSesion(sesionU);
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una sesión por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sesión eliminada correctamente"),
            @ApiResponse(responseCode = "400", description = "No se pudo eliminar la sesión")
    })
    public ResponseEntity<Void> deleteSesion(@PathVariable int id) {
        sesionService.deleteSesion(id);
        return ResponseEntity.ok().build();
    }
}
