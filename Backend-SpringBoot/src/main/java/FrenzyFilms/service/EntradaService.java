package FrenzyFilms.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import FrenzyFilms.entity.Admin;
import FrenzyFilms.entity.Entrada;
import FrenzyFilms.entity.Persona;
import FrenzyFilms.entity.Sala;
import FrenzyFilms.entity.Usuario;
import FrenzyFilms.entity.Sesion;
import FrenzyFilms.repository.EntradaRepository;
import FrenzyFilms.security.JWTUtils;

@Service
public class EntradaService {

	@Autowired
	private EntradaRepository entradaRepository;

	@Autowired
	private UsuarioService usuarioService;

	@Autowired
	private SesionService sesionService;

	@Autowired
	private SalaService salaService;

	@Autowired
	private JWTUtils JWTUtils;

	public Set<Entrada> getAllEntradasByUsuario() {
		Usuario usuario = JWTUtils.userLogin();
		return usuario.getEntradas();
	}

	public Set<Entrada> getAllEntradasBySesion(int idSesion) {
		Persona userLogin = JWTUtils.userLogin();

		if (!(userLogin instanceof Admin)) {
			throw new AccessDeniedException(
					"Solo los administradores pueden acceder a todas las entradas de una sesion.");
		}

		Sesion sesion = sesionService.getSesionById(idSesion)
				.orElseThrow(() -> new EntityNotFoundException("Sesion no encontrada."));

		return sesion.getEntradas();
	}

	public Entrada getEntradaById(int id) {
		Optional<Entrada> entradaO = entradaRepository.findById(id);

		if (!entradaO.isPresent()) {
			throw new EntityNotFoundException("Entrada no encontrada.");
		}

		Entrada entrada = entradaO.get();
		Persona userLogin = JWTUtils.userLogin();

		if (userLogin instanceof Admin) {
			return entrada;
		}

		if (userLogin instanceof Usuario) {
			Usuario usuario = (Usuario) userLogin;
			if (usuario.getEntradas().contains(entrada)) {
				return entrada;
			}
		}

		throw new AccessDeniedException("No tienes permiso para acceder a esta entrada.");
	}

	@Transactional
	public Entrada saveEntrada(Entrada entrada) {
		return entradaRepository.save(entrada);
	}

	@Transactional
	public Entrada createEntrada(Entrada entrada, int idSesion) {
		Optional<Sesion> sesionO = sesionService.getSesionById(idSesion);

		if (!sesionO.isPresent()) {
			throw new EntityNotFoundException("Sesión no encontrada.");
		}

		Sesion sesion = sesionO.get();
		int disponibles = sesionService.getNumAsientosDisponibles(sesion);

		if (disponibles <= 0) {
			throw new IllegalStateException("No hay asientos disponibles.");
		}

		LocalDateTime inicio = sesionService.getInicioSesion(sesion);
		if (!inicio.isAfter(LocalDateTime.now())) {
			throw new IllegalStateException("La sesión ya ha comenzado.");
		}

		if (!asientoExisteEnSala(sesion, entrada.getNumFila(), entrada.getNumAsiento())) {
			throw new IllegalArgumentException("El asiento seleccionado no existe en la sala.");
		}

		if (asientoOcupado(sesion, entrada.getNumFila(), entrada.getNumAsiento())) {
			throw new IllegalArgumentException("El asiento ya está ocupado.");
		}

		Usuario usuario = JWTUtils.userLogin();

		int numEntradasUsuario = getNumEntradasUsuarioEnSesion(usuario, sesion);

		if (numEntradasUsuario >= 10) {
			throw new IllegalStateException("No puedes comprar más de 10 entradas para una misma sesión.");
		}

		Entrada nueva = entradaRepository.save(entrada);

		usuario.getEntradas().add(nueva);
		usuarioService.saveUsuario(usuario);

		sesion.getEntradas().add(nueva);
		sesionService.saveSesion(sesion);

		return nueva;
	}

	public int getNumEntradasUsuarioEnSesion(Usuario usuario, Sesion sesion) {
		int entradas = 0;

		for (Entrada entrada : usuario.getEntradas()) {
			Optional<Sesion> sesionEntrada = sesionService.findByEntrada(entrada);

			if (sesionEntrada.isPresent() && sesionEntrada.get().getId() == sesion.getId()) {
				entradas++;
			}
		}

		return entradas;
	}

	private boolean asientoExisteEnSala(Sesion sesion, int numFila, int numAsiento) {
		Optional<Sala> salaO = salaService.findBySesion(sesion);

		if (!salaO.isPresent()) {
			throw new EntityNotFoundException("Sala asociada a la sesión no encontrada.");
		}

		Sala sala = salaO.get();
		return numFila >= 1 && numFila <= sala.getNumFilas()
				&& numAsiento >= 1 && numAsiento <= sala.getNumColumnas();
	}

	public boolean asientoOcupado(Sesion sesion, int numFila, int numAsiento) {
		for (Entrada entrada : sesion.getEntradas()) {
			if (entrada.getNumFila() == numFila && entrada.getNumAsiento() == numAsiento) {
				return true;
			}
		}
		return false;
	}

	public boolean puedeCancelarEntrada(Sesion sesion) {
		LocalDateTime inicio = sesionService.getInicioSesion(sesion);
		return LocalDateTime.now().isBefore(inicio.minusHours(1));
	}

	@Transactional
	public void deleteEntrada(int id) {
		Optional<Entrada> entradaO = entradaRepository.findById(id);
		if (!entradaO.isPresent()) {
			throw new EntityNotFoundException("Entrada no encontrada.");
		}

		Entrada entrada = entradaO.get();
		Optional<Sesion> sesionO = sesionService.findByEntrada(entrada);
		Optional<Usuario> propietarioO = usuarioService.findByEntrada(entrada);
		Persona userLogin = JWTUtils.userLogin();

		if (!sesionO.isPresent()) {
			throw new EntityNotFoundException("Sesión asociada no encontrada.");
		}
		if (!propietarioO.isPresent()) {
			throw new EntityNotFoundException("Propietario de la entrada no encontrado.");
		}
		if (userLogin == null) {
			throw new AccessDeniedException("Debes iniciar sesión.");
		}

		Sesion sesion = sesionO.get();
		Usuario propietario = propietarioO.get();

		boolean esAdmin = userLogin instanceof Admin;
		boolean esPropietario = userLogin instanceof Usuario &&
				propietario.getId() == userLogin.getId();

		if (!(esAdmin || esPropietario)) {
			throw new AccessDeniedException("No tienes permiso para cancelar esta entrada.");
		}

		if (!puedeCancelarEntrada(sesion)) {
			throw new IllegalStateException("No se puede cancelar una entrada con menos de 1 hora de antelación.");
		}

		sesion.getEntradas().remove(entrada);
		sesionService.saveSesion(sesion);

		propietario.getEntradas().remove(entrada);
		usuarioService.saveUsuario(propietario);

		entradaRepository.delete(entrada);
	}
}
