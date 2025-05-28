package FrenzyFilms.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import FrenzyFilms.entity.Admin;
import FrenzyFilms.entity.Roles;
import FrenzyFilms.entity.Usuario;
import FrenzyFilms.repository.AdminRepository;
import FrenzyFilms.security.JWTUtils;

@Service
public class AdminService {

	@Autowired
	private AdminRepository adminRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JWTUtils JWTUtils;

	@Transactional
	public Admin saveAdmin(Admin admin) {
		return adminRepository.save(admin);
	}

	@Transactional
	public Admin createAdmin(Admin admin) {
		admin.setRol(Roles.ADMIN);
		admin.setPassword(passwordEncoder.encode(admin.getPassword()));

		if (admin.getFoto() == null || admin.getFoto().isEmpty() || admin.getFoto().isBlank()) {
			admin.setFoto("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png");
		}

		return adminRepository.save(admin);
	}

	@Transactional
	public Admin updateAdmin(Admin adminU) {
		Admin admin = JWTUtils.userLogin();

		if (admin == null) {
			throw new AccessDeniedException("Debes estar autenticado para actualizar tus datos.");
		}

		admin.setNombre(adminU.getNombre());
		admin.setEmail(adminU.getEmail());
		admin.setTelefono(adminU.getTelefono());

		if (adminU.getFoto() == null || adminU.getFoto().trim().isEmpty()) {
			admin.setFoto(
					"https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png");
		} else {
			admin.setFoto(adminU.getFoto());
		}

		if (adminU.getPassword() != null && !adminU.getPassword().isEmpty()) {
			admin.setPassword(passwordEncoder.encode(adminU.getPassword()));
		}

		return adminRepository.save(admin);
	}

	public List<Admin> getAllAdmins() {
		return adminRepository.findAll();
	}

	public Optional<Admin> getAdminById(int id) {
		return adminRepository.findById(id);
	}

	public Optional<Admin> findByUsername(String username) {
		return adminRepository.findByUsername(username);
	}

	@Transactional
	public boolean deleteAdmin() {
		Admin admin = JWTUtils.userLogin();

		if (admin == null) {
			throw new AccessDeniedException("Debes estar autenticado como administrador para eliminar tu cuenta.");
		}

		adminRepository.deleteById(admin.getId());
		return true;
	}

	public void adminPorDefecto() {
		if (this.getAllAdmins().size() <= 0) {
			Admin defaultAdmin = new Admin();
			defaultAdmin.setUsername("admin");
			defaultAdmin.setPassword(passwordEncoder.encode("adminadmin"));
			defaultAdmin.setNombre("admin");
			defaultAdmin.setEmail("admin@default.com");
			defaultAdmin.setTelefono("623456789");
			defaultAdmin.setFoto("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png");
			defaultAdmin.setRol(Roles.ADMIN);

			System.out.println("Admin creado por defecto");
			adminRepository.save(defaultAdmin);
		}
	}
}
