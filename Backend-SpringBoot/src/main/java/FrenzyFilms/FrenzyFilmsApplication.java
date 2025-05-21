package FrenzyFilms;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import FrenzyFilms.service.AdminService;

@SpringBootApplication
public class FrenzyFilmsApplication implements CommandLineRunner {

    @Autowired
    private AdminService adminService;

    public static void main(String[] args) {
        SpringApplication.run(FrenzyFilmsApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Invocar el método para crear el administrador por defecto si no existe
        adminService.adminPorDefecto();
    }
}
