package FrenzyFilms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import FrenzyFilms.entity.Sesion;

@Repository
public interface SesionRepository extends JpaRepository<Sesion, Integer> {

}
