package FrenzyFilms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import FrenzyFilms.entity.Entrada;

@Repository
public interface EntradaRepository extends JpaRepository<Entrada, Integer> {

}
