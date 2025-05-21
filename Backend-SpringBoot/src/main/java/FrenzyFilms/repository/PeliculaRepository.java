package FrenzyFilms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import FrenzyFilms.entity.Pelicula;
import FrenzyFilms.entity.Sesion;

@Repository
public interface PeliculaRepository extends JpaRepository<Pelicula, Integer> {
    Optional<Pelicula> findBySesionesContaining(Sesion sesion);
    Optional<Pelicula> findByTmdbId(int tmdbId);

}
