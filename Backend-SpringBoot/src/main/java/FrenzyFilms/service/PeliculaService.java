
package FrenzyFilms.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import FrenzyFilms.dto.TmdbCreditsResponse;
import FrenzyFilms.dto.TmdbMovieDetail;
import FrenzyFilms.entity.Admin;
import FrenzyFilms.entity.Estado;
import FrenzyFilms.entity.Pelicula;
import FrenzyFilms.entity.Persona;
import FrenzyFilms.entity.Sesion;
import FrenzyFilms.repository.PeliculaRepository;
import FrenzyFilms.security.JWTUtils;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PeliculaService {

    @Autowired
    private PeliculaRepository peliculaRepository;

    @Autowired
    private TmdbService tmdbService;

    @Autowired
    private JWTUtils JWTUtils;

    public List<Pelicula> getAllPeliculas() {
        return peliculaRepository.findAll();
    }

    public List<Pelicula> getPeliculasEnCartelera() {
        List<Pelicula> listaPeliculas = peliculaRepository.findAll();
        List<Pelicula> cartelera = new ArrayList<>();

        for (Pelicula p : listaPeliculas) {
            if (!p.getEstado().equals(Estado.DESCATALOGADA)) {
                cartelera.add(p);
            }
        }
        return cartelera;
    }

    public Optional<Pelicula> getPeliculaById(int id) {
        return peliculaRepository.findById(id);
    }

    public Optional<Pelicula> getPeliculaByTmdbId(int tmdbId) {
        return peliculaRepository.findByTmdbId(tmdbId);
    }

    public Optional<Pelicula> findBySesion(Sesion sesion) {
        return peliculaRepository.findBySesionesContaining(sesion);
    }

    @Transactional
    public Pelicula savePelicula(Pelicula pelicula) {
        return peliculaRepository.save(pelicula);
    }

    @Transactional
    public void actualizarEstado(int id, Estado nuevoEstado) {
        Persona userLogin = JWTUtils.userLogin();

        if (!(userLogin instanceof Admin)) {
            throw new AccessDeniedException("Solo los administradores pueden actualizar el estado.");
        }

        Pelicula pelicula = peliculaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Película no encontrada."));

        pelicula.setEstado(nuevoEstado);
        peliculaRepository.save(pelicula);
    }

    @Transactional
    public boolean deletePelicula(int id) {
        Persona userLogin = JWTUtils.userLogin();

        if (!(userLogin instanceof Admin)) {
            throw new AccessDeniedException("Solo los administradores pueden eliminar películas.");
        }

        Optional<Pelicula> peliculaO = peliculaRepository.findById(id);

        if (peliculaO.isPresent()) {
            Pelicula pelicula = peliculaO.get();

            if (pelicula.getSesiones().isEmpty()) {
                peliculaRepository.delete(pelicula);
                return true;
            }
        }

        return false;
    }

    @Transactional
    public Pelicula importarDesdeTmdb(int idTmdb) {
        Persona userLogin = JWTUtils.userLogin();

        if (!(userLogin instanceof Admin)) {
            throw new AccessDeniedException("Solo los administradores pueden importar películas desde TMDb.");
        }

        if (peliculaRepository.findByTmdbId(idTmdb).isPresent()) {
            throw new IllegalArgumentException("La película ya existe en la base de datos.");
        }

        TmdbMovieDetail detalle = tmdbService.obtenerDetallesPorId(idTmdb);
        TmdbCreditsResponse creditos = tmdbService.obtenerCreditosPorId(idTmdb);
        String clasificacion = tmdbService.obtenerClasificacionEdad(idTmdb);

        Pelicula pelicula = new Pelicula();
        pelicula.setTmdbId(detalle.getId());
        pelicula.setTitulo(detalle.getTitulo());
        pelicula.setClasificacionEdad(clasificacion);

        pelicula.setFechaEstreno(LocalDate.parse(
                detalle.getFechaEstreno(), DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH)));

        pelicula.setDuracion(detalle.getDuracion());

        StringBuilder generosBuilder = new StringBuilder();
        for (TmdbMovieDetail.Genre genero : detalle.getGeneros()) {
            if (generosBuilder.length() > 0) {
                generosBuilder.append(", ");
            }
            generosBuilder.append(genero.getName());
        }
        pelicula.setGenero(generosBuilder.toString());

        pelicula.setSinopsis(detalle.getOverview());
        pelicula.setCartel("https://image.tmdb.org/t/p/w500" + detalle.getCartel());
        pelicula.setBanner("https://image.tmdb.org/t/p/original" + detalle.getBanner());
        pelicula.setCalificacionTmdb(detalle.getPuntuacion());
        pelicula.setEstado(Estado.PROXIMAMENTE);
        pelicula.setSesiones(new HashSet<>());

        StringBuilder directoresBuilder = new StringBuilder();
        for (TmdbCreditsResponse.Crew crew : creditos.getCrew()) {
            if ("Director".equalsIgnoreCase(crew.getJob())) {
                if (directoresBuilder.length() > 0) {
                    directoresBuilder.append(", ");
                }
                directoresBuilder.append(crew.getName());
            }
        }
        String directores = directoresBuilder.length() > 0 ? directoresBuilder.toString() : "Desconocido";
        pelicula.setDirector(directores);

        // Generar JSON para los actores
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            List<java.util.Map<String, String>> actoresList = new ArrayList<>();

            List<TmdbCreditsResponse.Cast> topActores = creditos.getCast().stream()
                    .limit(10)
                    .toList();

            for (TmdbCreditsResponse.Cast actor : topActores) {
                java.util.Map<String, String> actorInfo = new java.util.HashMap<>();
                actorInfo.put("nombre", actor.getName());
                actorInfo.put("personaje", actor.getCharacter());
                actorInfo.put("foto",
                        actor.getProfile_path() != null ? "https://image.tmdb.org/t/p/w500" + actor.getProfile_path()
                                : null);
                actoresList.add(actorInfo);
            }

            String actoresJson = mapper.writeValueAsString(actoresList);
            pelicula.setActores(actoresJson);

        } catch (Exception e) {
            throw new RuntimeException("Error al generar JSON de actores", e);
        }

        return peliculaRepository.save(pelicula);
    }
}
