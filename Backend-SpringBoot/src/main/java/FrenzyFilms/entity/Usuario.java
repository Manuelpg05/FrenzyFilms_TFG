package FrenzyFilms.entity;

import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;

@Entity
public class Usuario extends Persona {
	
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
