package FrenzyFilms.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import FrenzyFilms.entity.Entrada;
import FrenzyFilms.entity.Usuario;
import FrenzyFilms.entity.Roles;
import FrenzyFilms.entity.Sesion;
import FrenzyFilms.repository.SesionRepository;
import FrenzyFilms.repository.UsuarioRepository;
import FrenzyFilms.security.JWTUtils;

@Service
public class UsuarioService {

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private SesionRepository sesionRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JWTUtils JWTUtils;

	@Transactional
	public Usuario saveUsuario(Usuario usuario) {
		return usuarioRepository.save(usuario);
	}

	@Transactional
	public Usuario createUsuario(Usuario usuario) {
		usuario.setEntradas(new HashSet<Entrada>());
		usuario.setRol(Roles.USER);
		usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

		if (usuario.getFoto() == null || usuario.getFoto().isEmpty() || usuario.getFoto().isBlank()) {
			usuario.setFoto(
					"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png");
		}

		return usuarioRepository.save(usuario);
	}

	@Transactional
	public Usuario updateUsuario(Usuario usuarioU) {
		Usuario usuario = JWTUtils.userLogin();

		if (usuario == null) {
			throw new AccessDeniedException("Debes estar autenticado para actualizar tus datos.");
		}

		usuario.setNombre(usuarioU.getNombre());
		usuario.setEmail(usuarioU.getEmail());
		usuario.setTelefono(usuarioU.getTelefono());
		usuario.setFoto(usuarioU.getFoto());
		usuario.setPassword(passwordEncoder.encode(usuarioU.getPassword()));

		return usuarioRepository.save(usuario);
	}

	public List<Usuario> getAllUsuarios() {
		return usuarioRepository.findAll();
	}

	public Optional<Usuario> getUsuarioById(int id) {
		return usuarioRepository.findById(id);
	}

	public Optional<Usuario> findByUsername(String username) {
		return usuarioRepository.findByUsername(username);
	}

	public Optional<Usuario> findByEntrada(Entrada entrada) {
		return usuarioRepository.findByEntradasContaining(entrada);
	}

	@Transactional
	public void deleteUsuario() {
		Usuario usuario = JWTUtils.userLogin();

		if (usuario == null) {
			throw new AccessDeniedException("Debes estar autenticado para eliminar tu cuenta.");
		}

		LocalDateTime ahora = LocalDateTime.now();

		for (Entrada entrada : usuario.getEntradas()) {
			Optional<Sesion> sesionO = sesionRepository.findByEntradasContaining(entrada);

			if (sesionO.isPresent()) {
				Sesion sesion = sesionO.get();

				LocalDateTime inicioSesion = LocalDateTime.of(sesion.getFecha(), sesion.getHoraInicio());

				if (inicioSesion.isAfter(ahora)) {
					throw new IllegalStateException("No puedes eliminar una cuenta con entradas en sesiones futuras.");
				}
			}
		}

		usuarioRepository.deleteById(usuario.getId());
	}
}
