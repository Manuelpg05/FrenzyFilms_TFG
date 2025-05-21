package FrenzyFilms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import FrenzyFilms.entity.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
	Optional<Admin> findByUsername(String username);
}
