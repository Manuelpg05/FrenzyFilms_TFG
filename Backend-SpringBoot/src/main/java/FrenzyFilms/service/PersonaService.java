package FrenzyFilms.service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import FrenzyFilms.entity.Persona;
import FrenzyFilms.repository.PersonaRepository;

@Service
public class PersonaService implements UserDetailsService {
	@Autowired
	private PersonaRepository personaRepository;

	public Optional<Persona> findByUsername(String username) {
		return personaRepository.findByUsername(username);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<Persona> persona0 = this.findByUsername(username);
		if (persona0.isPresent()) {
			Set<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();
			authorities.add(new SimpleGrantedAuthority(persona0.get().getRol().toString()));
			User user = new User(persona0.get().getUsername(), persona0.get().getPassword(), authorities);
			return user;
		} else {
			throw new UsernameNotFoundException("Username no encontrado");
		}
	}
}
