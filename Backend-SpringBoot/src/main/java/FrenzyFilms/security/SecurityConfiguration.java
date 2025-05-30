package FrenzyFilms.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private JWTAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .authorizeHttpRequests()

                // LOGIN & AUTH
                .requestMatchers(HttpMethod.POST, "/login").permitAll()
                .requestMatchers("/userLogin").permitAll()
                .requestMatchers("/personaExiste/**").permitAll()

                // TMDb - públicos
                .requestMatchers(HttpMethod.GET, "/tmdb/buscar").permitAll()
                .requestMatchers(HttpMethod.GET, "/tmdb/detalles/{idTmdb}").permitAll()
                .requestMatchers(HttpMethod.GET, "/tmdb/creditos/{idTmdb}").permitAll()
                .requestMatchers(HttpMethod.GET, "/tmdb/clasificacion/{idTmdb}").permitAll()

                // PELÍCULA
                .requestMatchers(HttpMethod.GET, "/pelicula").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.GET, "/pelicula/{id}").permitAll()
                .requestMatchers(HttpMethod.GET, "/pelicula/cartelera").permitAll()
                .requestMatchers(HttpMethod.GET, "/pelicula/sesion/{idSesion}").authenticated()
                .requestMatchers(HttpMethod.POST, "/pelicula/importar/{idTmdb}").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/pelicula/{id}/estado/{nuevoEstado}").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/pelicula/{id}").hasAuthority("ADMIN")

                // SALA
                .requestMatchers(HttpMethod.GET, "/sala").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.GET, "/sala/{id}").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.GET, "/sala/sesion/{idSesion}").permitAll()
                .requestMatchers(HttpMethod.POST, "/sala").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/sala/{id}").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/sala/{id}").hasAuthority("ADMIN")

                // SESIÓN
                .requestMatchers(HttpMethod.GET, "/sesion/{id}").permitAll()
                .requestMatchers(HttpMethod.GET, "/sesion/sala/{idSala}").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.GET, "/sesion/pelicula/{idPelicula}").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.GET, "/sesion/futuras/sala/{idSala}").permitAll()
                .requestMatchers(HttpMethod.GET, "/sesion/futuras/pelicula/{idPelicula}").permitAll()
                .requestMatchers(HttpMethod.GET, "/sesion/entrada/{idEntrada}").authenticated()
                .requestMatchers(HttpMethod.POST, "/sesion/P{idPelicula}/S{idSala}").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/sesion/{id}").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/sesion/{id}").hasAuthority("ADMIN")

                // ENTRADA
                .requestMatchers(HttpMethod.GET, "/entrada/{id}").hasAuthority("USER")
                .requestMatchers(HttpMethod.GET, "/entrada/usuario").hasAuthority("USER")
                .requestMatchers(HttpMethod.GET, "/entrada/usuario/detallado").hasAuthority("USER")
                .requestMatchers(HttpMethod.GET, "/entrada/sesion/{idSesion}").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.POST, "/entrada/{idSesion}").hasAuthority("USER")
                .requestMatchers(HttpMethod.DELETE, "/entrada/{id}").hasAuthority("USER")

                // USUARIO
                .requestMatchers(HttpMethod.POST, "/usuario").permitAll()
                .requestMatchers(HttpMethod.GET, "/usuario").permitAll()
                .requestMatchers(HttpMethod.GET, "/usuario/{id}").permitAll()
                .requestMatchers(HttpMethod.PUT, "/usuario").hasAuthority("USER")
                .requestMatchers(HttpMethod.DELETE, "/usuario").hasAuthority("USER")

                // ADMIN
                .requestMatchers(HttpMethod.POST, "/admin").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/admin").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/admin").hasAuthority("ADMIN")

                // SWAGGER
                .requestMatchers("/swagger-ui/**").permitAll()
                .requestMatchers("/v3/api-docs/**").permitAll()

                // TODO LO DEMÁS
                .anyRequest().authenticated();

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "https://frenzyfilms.onrender.com"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
