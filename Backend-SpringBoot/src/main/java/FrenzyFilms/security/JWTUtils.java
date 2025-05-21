package FrenzyFilms.security;

import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;
import FrenzyFilms.entity.Usuario;
import FrenzyFilms.entity.Admin;
import FrenzyFilms.entity.Persona;
import FrenzyFilms.service.PersonaService;
import FrenzyFilms.service.AdminService;
import FrenzyFilms.service.UsuarioService;

@Component
public class JWTUtils {
	private static final String JWT_FIRMA = "B8fN@2kLx!eT9zR$7uQwP#VmYcJr3HsD0oIaZgXnL5vKeMbC";
	private static final long EXTENCION_TOKEN = 86400000;

	@Autowired
	@Lazy
	private PersonaService personaService;

	@Autowired
	@Lazy
	private UsuarioService usuarioService;

	@Autowired
	@Lazy
	private AdminService adminService;

	public static String getToken(HttpServletRequest request) {
		String tokenBearer = request.getHeader("Authorization");
		if (StringUtils.hasText(tokenBearer) && tokenBearer.startsWith("Bearer ")) {
			return tokenBearer.substring(7);
		}
		return null;
	}

	public static boolean validateToken(String token) {
		try {
			Jwts.parser().setSigningKey(JWT_FIRMA).parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			throw new AuthenticationCredentialsNotFoundException("JWT ha experido o no es valido");
		}
	}

	public static String getUsernameOfToken(String token) {
		return Jwts.parser().setSigningKey(JWT_FIRMA).parseClaimsJws(token).getBody().getSubject();
	}

	public static String generateToken(Authentication authentication) {
		String username = authentication.getName();
		Date fechaActual = new Date();
		Date fechaExpiracion = new Date(fechaActual.getTime() + EXTENCION_TOKEN);
		String rol = authentication.getAuthorities().iterator().next().getAuthority();

		String token = Jwts.builder()
				.setSubject(username)
				.claim("rol", rol)
				.setIssuedAt(fechaActual)
				.setExpiration(fechaExpiracion)
				.signWith(SignatureAlgorithm.HS512, JWT_FIRMA)
				.compact();
		return token;
	}

	public <T> T userLogin() {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		T res = null;

		if (StringUtils.hasText(username)) {
			Optional<Persona> personaO = personaService.findByUsername(username);
			if (personaO.isPresent()) {
				Persona persona = personaO.get();
				switch (persona.getRol()) {
					case USER:
						Optional<Usuario> usuarioOptional = usuarioService.findByUsername(username);
						if (usuarioOptional.isPresent()) {
							res = (T) usuarioOptional.get();
						}
						break;
					case ADMIN:
						Optional<Admin> adminOptional = adminService.findByUsername(username);
						if (adminOptional.isPresent()) {
							res = (T) adminOptional.get();
						}
						break;
				}
			}
		}
		return res;
	}
}
