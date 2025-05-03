package FrenzyFilms.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Min;

@Entity
public class Sesion extends DomainEntity {
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
	@Column(nullable = false)
	private LocalDate fecha;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
	@Column(nullable = false)
	private LocalTime horaInicio;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
	@Column(nullable = false)
	private LocalTime horaFin;

	@Column(nullable = false)
	@Min(0)
	private int asientosDisponibles;

	@Column(nullable = false)
	@Min(0)
	private double precioEntrada;

	@OneToMany
	@JoinColumn(name="sesion_id")
	private Set<Entrada> entradas;

	public Sesion() {
		super();
	}

	public LocalDate getFecha() {
		return fecha;
	}

	public void setFecha(LocalDate fecha) {
		this.fecha = fecha;
	}

	public LocalTime getHoraInicio() {
		return horaInicio;
	}

	public void setHoraInicio(LocalTime horaInicio) {
		this.horaInicio = horaInicio;
	}

	public LocalTime getHoraFin() {
		return horaFin;
	}

	public void setHoraFin(LocalTime horaFin) {
		this.horaFin = horaFin;
	}

	public int getAsientosDisponibles() {
		return asientosDisponibles;
	}

	public void setAsientosDisponibles(int asientosDisponibles) {
		this.asientosDisponibles = asientosDisponibles;
	}

	public Set<Entrada> getEntradas() {
		return entradas;
	}

	public void setEntradas(Set<Entrada> entradas) {
		this.entradas = entradas;
	}
}
