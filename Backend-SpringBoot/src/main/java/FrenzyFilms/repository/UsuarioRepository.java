package FrenzyFilms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import FrenzyFilms.entity.Entrada;
import FrenzyFilms.entity.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{
	Optional<Usuario> findByUsername(String username);
	Optional<Usuario> findByEntradasContaining(Entrada entrada);

}
