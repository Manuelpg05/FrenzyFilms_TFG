package FrenzyFilms.entity;

import java.util.Set;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Min;

@Entity
public class Sala extends DomainEntity {

	@Column(unique = true, nullable = false)
	@Min(1)
	private int numSala;

	@Column(nullable = false)
	@Min(1)
	private int numFilas;

	@Column(nullable = false)
	@Min(1)
	private int numColumnas;

	@Schema(hidden = true)
	@OneToMany
	@JoinColumn(name = "sala_id")
	private Set<Sesion> sesiones;

	public Sala() {
		super();
	}

	public int getNumSala() {
		return numSala;
	}

	public void setNumSala(int numSala) {
		this.numSala = numSala;
	}

	public int getNumFilas() {
		return numFilas;
	}

	public void setNumFilas(int numFilas) {
		this.numFilas = numFilas;
	}

	public int getNumColumnas() {
		return numColumnas;
	}

	public void setNumColumnas(int numColumnas) {
		this.numColumnas = numColumnas;
	}

	@Schema(hidden = true)
	public int getNumAsientosTotal() {
		return numColumnas * numFilas;
	}

	public Set<Sesion> getSesiones() {
		return sesiones;
	}

	public void setSesiones(Set<Sesion> sesiones) {
		this.sesiones = sesiones;
	}
}
