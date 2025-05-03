package FrenzyFilms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import FrenzyFilms.entity.Sala;

@Repository
public interface SalaRepository extends JpaRepository<Sala, Integer> {

}
