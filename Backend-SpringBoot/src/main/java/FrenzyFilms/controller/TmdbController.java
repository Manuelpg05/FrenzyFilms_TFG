package FrenzyFilms.controller;

import FrenzyFilms.dto.TmdbCreditsResponse;
import FrenzyFilms.dto.TmdbMovieDetail;
import FrenzyFilms.dto.TmdbSearchResponse;
import FrenzyFilms.service.TmdbService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tmdb")
@Tag(name = "TMDb", description = "Endpoints públicos para consultar datos desde The Movie Database")
public class TmdbController {

    @Autowired
    private TmdbService tmdbService;

    @GetMapping("/buscar")
    @Operation(summary = "Buscar películas en TMDb por título y página")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Resultados de búsqueda obtenidos correctamente"),
        @ApiResponse(responseCode = "400", description = "Parámetros inválidos")
    })
    public ResponseEntity<TmdbSearchResponse> buscarPorTitulo(
            @RequestParam String titulo,
            @RequestParam(defaultValue = "1") int pagina) {
        TmdbSearchResponse resultados = tmdbService.buscarPorTitulo(titulo, pagina);
        return ResponseEntity.ok(resultados);
    }

    @GetMapping("/detalles/{idTmdb}")
    @Operation(summary = "Obtener detalles de una película desde TMDb por su ID de TMDb")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Detalles obtenidos correctamente"),
        @ApiResponse(responseCode = "404", description = "Película no encontrada")
    })
    public ResponseEntity<TmdbMovieDetail> obtenerDetalles(@PathVariable int idTmdb) {
        TmdbMovieDetail detalles = tmdbService.obtenerDetallesPorId(idTmdb);
        return ResponseEntity.ok(detalles);
    }

    @GetMapping("/creditos/{idTmdb}")
    @Operation(summary = "Obtener créditos (director, reparto) desde TMDb por ID de película")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Créditos obtenidos correctamente"),
        @ApiResponse(responseCode = "404", description = "Película no encontrada")
    })
    public ResponseEntity<TmdbCreditsResponse> obtenerCreditos(@PathVariable int idTmdb) {
        TmdbCreditsResponse creditos = tmdbService.obtenerCreditosPorId(idTmdb);
        return ResponseEntity.ok(creditos);
    }

    @GetMapping("/clasificacion/{idTmdb}")
    @Operation(summary = "Obtener la clasificación por edad desde TMDb para España")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Clasificación obtenida correctamente"),
        @ApiResponse(responseCode = "404", description = "Película no encontrada")
    })
    public ResponseEntity<String> obtenerClasificacionEdad(@PathVariable int idTmdb) {
        String clasificacion = tmdbService.obtenerClasificacionEdad(idTmdb);
        return ResponseEntity.ok(clasificacion);
    }
}
