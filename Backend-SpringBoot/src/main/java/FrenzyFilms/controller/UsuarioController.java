
package FrenzyFilms.controller;

import FrenzyFilms.entity.Usuario;
import FrenzyFilms.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuario")
@Tag(name = "Usuario", description = "Operaciones relacionadas con los usuarios del sistema")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Obtener todos los usuarios")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuarios obtenidos correctamente")
    })
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.getAllUsuarios());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un usuario por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable int id) {
        Optional<Usuario> usuario = usuarioService.getUsuarioById(id);
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo usuario")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario creado correctamente")
    })
    public ResponseEntity<Usuario> createUsuario(@RequestBody Usuario usuario) {
        Usuario creado = usuarioService.createUsuario(usuario);
        return ResponseEntity.ok(creado);
    }

    @PutMapping
    @Operation(summary = "Actualizar los datos del usuario autenticado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario actualizado correctamente"),
        @ApiResponse(responseCode = "403", description = "No autorizado")
    })
    public ResponseEntity<Usuario> updateUsuario(@RequestBody Usuario usuarioU) {
        Usuario actualizado = usuarioService.updateUsuario(usuarioU);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping
    @Operation(summary = "Eliminar la cuenta del usuario autenticado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario eliminado correctamente"),
        @ApiResponse(responseCode = "403", description = "No autorizado")
    })
    public ResponseEntity<Void> deleteUsuario() {
        usuarioService.deleteUsuario();
        return ResponseEntity.ok().build();
    }
}
