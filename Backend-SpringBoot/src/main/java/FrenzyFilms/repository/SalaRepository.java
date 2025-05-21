package FrenzyFilms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import FrenzyFilms.entity.Sala;
import FrenzyFilms.entity.Sesion;

@Repository
public interface SalaRepository extends JpaRepository<Sala, Integer> {
		Optional<Sala> findByNumSala(int numSala);
		Optional<Sala> findBySesionesContaining(Sesion sesion);

}
