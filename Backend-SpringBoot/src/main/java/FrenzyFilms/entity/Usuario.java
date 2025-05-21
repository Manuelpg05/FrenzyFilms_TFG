package FrenzyFilms.entity;

import java.util.Set;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;

@Entity
public class Usuario extends Persona {
	
	@Schema(hidden = true)
	@OneToMany
	@JoinColumn(name="usuario_id")
	private Set<Entrada> entradas;

	public Usuario() {
		super();
	}

	public Set<Entrada> getEntradas() {
		return entradas;
	}

	public void setEntradas(Set<Entrada> entradas) {
		this.entradas = entradas;
	}
}
