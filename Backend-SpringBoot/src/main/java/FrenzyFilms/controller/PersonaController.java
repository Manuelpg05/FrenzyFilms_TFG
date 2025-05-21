package FrenzyFilms.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import FrenzyFilms.entity.Persona;
import FrenzyFilms.entity.PersonaLogin;
import FrenzyFilms.security.JWTUtils;
import FrenzyFilms.service.PersonaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Persona", description = "Operaciones relacionadas con la autenticación y verificación de personas")
public class PersonaController {
	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JWTUtils JWTUtils;

	@Autowired
	private PersonaService personaService;

	@PostMapping("/login")
	@Operation(summary = "Autenticar usuario y generar token JWT")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Autenticación exitosa y token generado"),
			@ApiResponse(responseCode = "401", description = "Credenciales inválidas")
	})
	public ResponseEntity<Map<String, String>> login(@RequestBody PersonaLogin personaLogin) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(personaLogin.getUsername(), personaLogin.getPassword()));
		SecurityContextHolder.getContext().setAuthentication(authentication);

		String token = JWTUtils.generateToken(authentication);

		Map<String, String> response = new HashMap<>();
		response.put("token", token);

		return ResponseEntity.ok(response);
	}

	@GetMapping("/userLogin")
	@Operation(summary = "Obtener los datos del usuario autenticado")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Datos del usuario obtenidos correctamente"),
			@ApiResponse(responseCode = "401", description = "Usuario no autenticado")
	})
	public ResponseEntity<Persona> login() {
		Persona a = JWTUtils.userLogin();
		if (a == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		return ResponseEntity.ok(a);
	}

	@GetMapping("/personaExiste/{username}")
	@Operation(summary = "Comprobar si un nombre de usuario ya existe")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Verificación realizada correctamente")
	})
	public ResponseEntity<Boolean> checkUserExists(@PathVariable String username) {
		boolean exists = personaService.findByUsername(username).isPresent();
		return ResponseEntity.ok(exists);
	}
}
