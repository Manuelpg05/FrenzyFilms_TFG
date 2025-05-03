package FrenzyFilms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import FrenzyFilms.entity.Persona;

@Repository
public interface ActorRepository extends JpaRepository<Persona, Integer>{
	public Optional<Persona> findByUsername(String username);
}
