package FrenzyFilms.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import FrenzyFilms.entity.Admin;
import FrenzyFilms.entity.Entrada;
import FrenzyFilms.entity.Sesion;
import FrenzyFilms.entity.Persona;
import FrenzyFilms.entity.Sala;
import FrenzyFilms.entity.Usuario;
import FrenzyFilms.entity.Pelicula;
import FrenzyFilms.repository.SesionRepository;
import FrenzyFilms.security.JWTUtils;

@Service
public class SesionService {
	@Autowired
	private SesionRepository sesionRepository;

	@Autowired
	private PeliculaService peliculaService;

	@Autowired
	private SalaService salaService;

	@Autowired
	private UsuarioService usuarioService;

	@Autowired
	private CorreoService correoService;

	@Autowired
	private JWTUtils JWTUtils;

	public Set<Sesion> getAllSesionesBySala(int idSala) {
		Persona userLogin = JWTUtils.userLogin();

		if (!(userLogin instanceof Admin)) {
			throw new AccessDeniedException(
					"Solo los administradores pueden acceder a todas las sesiones de una sala.");
		}

		Sala sala = salaService.getSalaById(idSala)
				.orElseThrow(() -> new EntityNotFoundException("Sala no encontrada."));

		return sala.getSesiones();
	}

	public Set<Sesion> getAllSesionesByPelicula(int idPelicula) {
		Persona userLogin = JWTUtils.userLogin();

		if (!(userLogin instanceof Admin)) {
			throw new AccessDeniedException(
					"Solo los administradores pueden acceder a todas las sesiones de una pelicula.");
		}

		Pelicula pelicula = peliculaService.getPeliculaById(idPelicula)
				.orElseThrow(() -> new EntityNotFoundException("Película no encontrada."));

		return pelicula.getSesiones();
	}

	public Set<Sesion> getSesionesFuturas(Set<Sesion> sesiones) {
		Set<Sesion> futuras = new HashSet<>();
		LocalDateTime ahora = LocalDateTime.now();

		for (Sesion sesion : sesiones) {
			LocalDateTime inicio = getInicioSesion(sesion);
			if (inicio.isAfter(ahora)) {
				futuras.add(sesion);
			}
		}
		return futuras;
	}

	@Transactional
	public Optional<Sesion> getSesionById(int id) {
		return sesionRepository.findById(id);
	}

	public LocalDateTime getInicioSesion(Sesion sesion) {
		return LocalDateTime.of(sesion.getFecha(), sesion.getHoraInicio());
	}

	public LocalDateTime getFinSesion(Sesion sesion) {
		LocalDateTime inicio = getInicioSesion(sesion);
		int duracion = getDuracionSesion(sesion);

		return inicio.plusMinutes(duracion);
	}

	public int getNumAsientosDisponibles(Sesion sesion) {
		Optional<Sala> salaO = salaService.findBySesion(sesion);

		if (salaO.isPresent()) {
			Sala sala = salaO.get();
			int total = sala.getNumAsientosTotal();
			int ocupados = sesion.getEntradas().size();
			int disponibles = total - ocupados;

			return Math.max(disponibles, 0);
		}

		throw new IllegalStateException("La sesión no está asociada a ninguna sala.");
	}

	public int getDuracionSesion(Sesion sesion) {
		Optional<Pelicula> peliculaO = peliculaService.findBySesion(sesion);

		if (peliculaO.isPresent()) {
			Pelicula pelicula = peliculaO.get();
			return pelicula.getDuracion();
		}

		throw new IllegalStateException("La sesión no está asociada a ninguna película.");
	}

	public Set<Usuario> getUsuariosConEntrada(Sesion sesion) {
		Set<Usuario> usuarios = new HashSet<>();

		for (Entrada entrada : sesion.getEntradas()) {
			Optional<Usuario> usuarioO = usuarioService.findByEntrada(entrada);
			if (usuarioO.isPresent()) {
				usuarios.add(usuarioO.get());
			}
		}

		return usuarios;
	}

	public Optional<Sesion> findByEntrada(Entrada entrada) {
		return sesionRepository.findByEntradasContaining(entrada);
	}

	@Transactional
	public Sesion saveSesion(Sesion sesion) {
		return sesionRepository.save(sesion);
	}

	@Transactional
	public Sesion createSesion(Sesion nuevaSesion, int idPelicula, int idSala) {
		Persona userLogin = JWTUtils.userLogin();

		if (!(userLogin instanceof Admin)) {
			throw new AccessDeniedException("Solo los administradores pueden crear sesiones.");
		}

		Pelicula pelicula = peliculaService.getPeliculaById(idPelicula)
				.orElseThrow(() -> new EntityNotFoundException("Película no encontrada."));

		Sala sala = salaService.getSalaById(idSala)
				.orElseThrow(() -> new EntityNotFoundException("Sala no encontrada."));

		LocalDateTime inicio = getInicioSesion(nuevaSesion);
		if (!inicio.isAfter(LocalDateTime.now())) {
			throw new IllegalArgumentException("La fecha de inicio debe ser futura.");
		}

		if (hayConflictoDeHorario(nuevaSesion, pelicula, sala)) {
			throw new IllegalStateException("Conflicto de horario con otra sesión en la sala.");
		}

		nuevaSesion.setEntradas(new HashSet<>());

		Sesion guardada = sesionRepository.save(nuevaSesion);

		sala.getSesiones().add(guardada);
		salaService.saveSala(sala);

		pelicula.getSesiones().add(guardada);
		peliculaService.savePelicula(pelicula);

		return guardada;
	}

	public boolean hayConflictoDeHorario(Sesion nuevaSesion, Pelicula pelicula, Sala sala) {
		Set<Sesion> sesionesExistentes = sala.getSesiones();

		LocalDateTime inicioNueva = getInicioSesion(nuevaSesion);
		LocalDateTime finNueva = inicioNueva.plusMinutes(pelicula.getDuracion());

		for (Sesion sesion : sesionesExistentes) {
			// Ignorar la misma sesión si estamos actualizando
			if (nuevaSesion.getId() != 0 && nuevaSesion.getId() == sesion.getId()) {
				continue;
			}

			LocalDateTime inicioExistente = getInicioSesion(sesion);
			LocalDateTime finExistente = getFinSesion(sesion);

			if (inicioNueva.isBefore(finExistente) && finNueva.isAfter(inicioExistente)) {
				return true;
			}
		}
		return false;
	}

	@Transactional
	public Sesion updateSesion(Sesion sesionU) {
		Persona userLogin = JWTUtils.userLogin();

		if (!(userLogin instanceof Admin)) {
			throw new AccessDeniedException("Solo los administradores pueden actualizar sesiones.");
		}

		Sesion sesion = sesionRepository.findById(sesionU.getId())
				.orElseThrow(() -> new EntityNotFoundException("Sesión no encontrada."));

		if (!sesion.getEntradas().isEmpty()) {
			throw new IllegalStateException("No se puede modificar una sesión con entradas vendidas.");
		}

		sesion.setFecha(sesionU.getFecha());
		sesion.setHoraInicio(sesionU.getHoraInicio());

		if (!getInicioSesion(sesion).isAfter(LocalDateTime.now())) {
			throw new IllegalArgumentException("La fecha de inicio debe ser futura.");
		}

		Sala sala = salaService.findBySesion(sesion)
				.orElseThrow(() -> new IllegalStateException("La sesión no está asociada a ninguna sala."));
		Pelicula pelicula = peliculaService.findBySesion(sesion)
				.orElseThrow(() -> new IllegalStateException("La sesión no está asociada a ninguna película."));

		if (hayConflictoDeHorario(sesion, pelicula, sala)) {
			throw new IllegalStateException("Conflicto de horario con otra sesión en la sala.");
		}

		return sesionRepository.save(sesion);
	}

	@Transactional
	public void deleteSesion(int id) {
		Persona userLogin = JWTUtils.userLogin();

		if (!(userLogin instanceof Admin)) {
			throw new AccessDeniedException("Solo los administradores pueden eliminar sesiones.");
		}

		Sesion sesion = sesionRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Sesión no encontrada."));

		Set<Usuario> usuarios = getUsuariosConEntrada(sesion);
		for (Usuario usuario : usuarios) {
			correoService.enviarAvisoCancelacion(usuario.getEmail(), sesion);
		}

		Optional<Pelicula> peliculaO = peliculaService.findBySesion(sesion);
		if (peliculaO.isPresent()) {
			Pelicula pelicula = peliculaO.get();
			pelicula.getSesiones().remove(sesion);
			peliculaService.savePelicula(pelicula);
		}

		Optional<Sala> salaO = salaService.findBySesion(sesion);
		if (salaO.isPresent()) {
			Sala sala = salaO.get();
			sala.getSesiones().remove(sesion);
			salaService.saveSala(sala);
		}

		eliminarEntradasDeUsuariosEnSesion(sesion);

		sesionRepository.delete(sesion);
	}

	public void eliminarEntradasDeUsuariosEnSesion(Sesion sesion) {
		Set<Usuario> usuarios = getUsuariosConEntrada(sesion);

		for (Usuario usuario : usuarios) {
			Set<Entrada> entradasAEliminar = new HashSet<>();

			for (Entrada entrada : usuario.getEntradas()) {
				Optional<Sesion> sesionDeEntrada = findByEntrada(entrada);

				if (sesionDeEntrada.isPresent() && sesionDeEntrada.get().getId() == sesion.getId()) {
					entradasAEliminar.add(entrada);
				}
			}

			usuario.getEntradas().removeAll(entradasAEliminar);
			usuarioService.saveUsuario(usuario);
		}
	}
}
