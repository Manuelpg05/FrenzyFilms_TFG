package FrenzyFilms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import FrenzyFilms.entity.Entrada;
import FrenzyFilms.entity.Sesion;

@Repository
public interface SesionRepository extends JpaRepository<Sesion, Integer> {
    Optional<Sesion> findByEntradasContaining(Entrada entrada);

}
