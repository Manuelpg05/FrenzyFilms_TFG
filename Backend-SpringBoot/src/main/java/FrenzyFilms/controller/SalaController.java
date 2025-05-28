
package FrenzyFilms.controller;

import FrenzyFilms.entity.Sala;
import FrenzyFilms.entity.Sesion;
import FrenzyFilms.service.SalaService;
import FrenzyFilms.service.SesionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sala")
@Tag(name = "Sala", description = "Operaciones relacionadas con las salas del cine")
public class SalaController {

    @Autowired
    private SalaService salaService;

    @Autowired
    private SesionService sesionService;

    @GetMapping
    @Operation(summary = "Obtener todas las salas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de salas obtenida correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<List<Sala>> getAllSalas() {
        List<Sala> salas = salaService.getAllSalas();
        return ResponseEntity.ok(salas);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una sala por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sala encontrada"),
            @ApiResponse(responseCode = "404", description = "Sala no encontrada")
    })
    public ResponseEntity<Sala> getSalaById(@PathVariable int id) {
        Optional<Sala> sala = salaService.getSalaById(id);
        if (sala.isPresent()) {
            return ResponseEntity.ok(sala.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/sesion/{idSesion}")
    @Operation(summary = "Obtener la sala asociada a una sesión")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sala encontrada correctamente"),
            @ApiResponse(responseCode = "404", description = "Sesión o sala no encontrada")
    })
    public ResponseEntity<Sala> getSalaBySesion(@PathVariable int idSesion) {
        Optional<Sesion> sesionO = sesionService.getSesionById(idSesion);
        if (!sesionO.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Sala> salaO = salaService.findBySesion(sesionO.get());
        if (!salaO.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(salaO.get());
    }

    @PostMapping
    @Operation(summary = "Crear una nueva sala")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sala creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Ya existe una sala con ese número")
    })
    public ResponseEntity<Sala> createSala(@RequestBody Sala sala) {
        Sala creada = salaService.createSala(sala);
        return ResponseEntity.ok(creada);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una sala existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sala actualizada correctamente"),
            @ApiResponse(responseCode = "400", description = "No se puede actualizar la sala")
    })
    public ResponseEntity<Sala> updateSala(@PathVariable int id, @RequestBody Sala salaU) {
        salaU.setId(id);
        Sala actualizada = salaService.updateSala(salaU);
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una sala por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sala eliminada correctamente"),
            @ApiResponse(responseCode = "400", description = "No se puede eliminar la sala")
    })
    public ResponseEntity<Void> deleteSala(@PathVariable int id) {
        salaService.deleteSala(id);
        return ResponseEntity.ok().build();
    }
}
