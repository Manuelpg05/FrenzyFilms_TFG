package FrenzyFilms.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import FrenzyFilms.service.PersonaService;

@Component
public class JWTAuthenticationFilter extends OncePerRequestFilter {
	@Autowired
	private PersonaService personaService;

	public JWTAuthenticationFilter(PersonaService personaService) {
		this.personaService = personaService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String token = JWTUtils.getToken(request);
		if (StringUtils.hasText(token) && JWTUtils.validateToken(token)) {
			String username = JWTUtils.getUsernameOfToken(token);
			UserDetails userDetails = personaService.loadUserByUsername(username);

			UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
					userDetails, null, userDetails.getAuthorities());
			SecurityContextHolder.getContext().setAuthentication(authenticationToken);
		}
		filterChain.doFilter(request, response);
	}

}
