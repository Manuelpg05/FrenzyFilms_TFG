package FrenzyFilms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import FrenzyFilms.entity.Admin;
import FrenzyFilms.service.AdminService;

@RestController
@RequestMapping("/admin")
@Tag(name = "Admin", description = "Operaciones relacionadas con la gestión de los administradores")
public class AdminController {

	@Autowired
	private AdminService adminService;

	@PostMapping
	@Operation(summary = "Crear un nuevo administrador")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Administrador creado correctamente")
	})
	public ResponseEntity<Admin> saveAdmin(@RequestBody Admin admin) {
		Admin creado = adminService.createAdmin(admin);
		return ResponseEntity.ok(creado);
	}

	@PutMapping
    @Operation(summary = "Actualizar los datos del administrador autenticado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Administrador actualizado correctamente"),
            @ApiResponse(responseCode = "403", description = "No autorizado")
    })
    public ResponseEntity<Admin> updateAdmin(@RequestBody Admin adminU) {
        Admin actualizado = adminService.updateAdmin(adminU);
        return ResponseEntity.ok(actualizado);
    }

	@DeleteMapping
	@Operation(summary = "Eliminar un administrador logueado")
	@ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Administrador eliminado exitosamente"),
			@ApiResponse(responseCode = "404", description = "Administrador no encontrado") })
	public void deleteAdmin() {
		if (adminService.deleteAdmin()) {
			ResponseEntity.status(HttpStatus.OK).body("Administrador eliminado exitosamente");
		} else {
			ResponseEntity.status(HttpStatus.NOT_FOUND).body("Administrador no encontrado");
		}
	}
}
