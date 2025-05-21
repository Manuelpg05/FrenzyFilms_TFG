package FrenzyFilms.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import FrenzyFilms.entity.Sesion;
import FrenzyFilms.entity.Admin;
import FrenzyFilms.entity.Persona;
import FrenzyFilms.entity.Sala;
import FrenzyFilms.repository.SalaRepository;
import FrenzyFilms.security.JWTUtils;

@Service
public class SalaService {

	@Autowired
	private SalaRepository salaRepository;

	@Autowired
	private JWTUtils JWTUtils;

	public List<Sala> getAllSalas() {
		return salaRepository.findAll();
	}

	public Optional<Sala> getSalaById(int id) {
		return salaRepository.findById(id);
	}

	public Optional<Sala> getSalaByNumSala(int numSala) {
		return salaRepository.findByNumSala(numSala);
	}

	public Optional<Sala> findBySesion(Sesion sesion) {
		return salaRepository.findBySesionesContaining(sesion);
	}

	@Transactional
	public Sala saveSala(Sala sala) {
		return salaRepository.save(sala);
	}

	@Transactional
	public Sala createSala(Sala sala) {
		Persona userLogin = JWTUtils.userLogin();

		if (!(userLogin instanceof Admin)) {
			throw new AccessDeniedException("Solo los administradores pueden crear salas.");
		}

		if (salaRepository.findByNumSala(sala.getNumSala()).isPresent()) {
			throw new IllegalArgumentException("Ya existe una sala con ese número.");
		}

		sala.setSesiones(new HashSet<>());
		return salaRepository.save(sala);
	}

	@Transactional
	public Sala updateSala(Sala salaU) {
		Persona userLogin = JWTUtils.userLogin();

		if (!(userLogin instanceof Admin)) {
			throw new AccessDeniedException("Solo los administradores pueden actualizar salas.");
		}

		Optional<Sala> salaO = salaRepository.findById(salaU.getId());

		if (!salaO.isPresent()) {
			throw new EntityNotFoundException("Sala no encontrada.");
		}

		Sala sala = salaO.get();

		if (!sala.getSesiones().isEmpty()) {
			throw new IllegalStateException("No se puede modificar una sala con sesiones asignadas.");
		}

		sala.setNumSala(salaU.getNumSala());
		sala.setNumFilas(salaU.getNumFilas());
		sala.setNumColumnas(salaU.getNumColumnas());

		return salaRepository.save(sala);
	}

	@Transactional
	public void deleteSala(int id) {
		Persona userLogin = JWTUtils.userLogin();

		if (!(userLogin instanceof Admin)) {
			throw new AccessDeniedException("Solo los administradores pueden eliminar salas.");
		}

		Optional<Sala> salaO = salaRepository.findById(id);

		if (!salaO.isPresent()) {
			throw new EntityNotFoundException("Sala no encontrada.");
		}

		Sala sala = salaO.get();

		if (!sala.getSesiones().isEmpty()) {
			throw new IllegalStateException("No se puede eliminar una sala con sesiones asignadas.");
		}

		salaRepository.delete(sala);
	}
}
