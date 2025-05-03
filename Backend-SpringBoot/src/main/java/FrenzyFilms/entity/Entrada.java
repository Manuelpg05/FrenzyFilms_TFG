package FrenzyFilms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Min;

@Entity
public class Entrada extends DomainEntity {
	
	@Column(nullable = false)
	@Min(1)
	private int numAsiento;

	@Column(nullable = false)
	@Min(1)
	private int numFila;

	public Entrada() {
		super();
	}

	public int getNumAsiento() {
		return numAsiento;
	}

	public void setNumAsiento(int numAsiento) {
		this.numAsiento = numAsiento;
	}

	public int getNumFila() {
		return numFila;
	}

	public void setNumFila(int numFila) {
		this.numFila = numFila;
	}
}
