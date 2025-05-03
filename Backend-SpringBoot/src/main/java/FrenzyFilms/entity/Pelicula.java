package FrenzyFilms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

@Entity
public class Pelicula extends DomainEntity {

    // Atributos recogidos de la BD de OMDB
    @NotBlank
    private String titulo;

    @Column(nullable = false)
    @Min(1800)
    private int anio;

    @NotBlank
    private ClasificacionEdad clasificacionEdad;

	@Column(nullable = false)
    private LocalDate fechaEstreno;

    @Column(nullable = false)
    @Min(1)
    private int duracion;

    @NotBlank
    private String genero;

    @NotBlank
    private String director;

    @NotBlank
    private String actores;

    @NotBlank
    private String sinopsis;

    @NotBlank
    private String cartel;

	@Column(nullable = false)
    private Double calificacionImdb;

    // Atributos propios
    @NotBlank
    private Estado estado;

    // Constructor por defecto
    public Pelicula() {
        super();
    }
    // Getters y setters
    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public int getAnio() {
        return anio;
    }

    public void setAnio(int anio) {
        this.anio = anio;
    }

    public ClasificacionEdad getClasificacionEdad() {
        return clasificacionEdad;
    }

    public void setClasificacionEdad(ClasificacionEdad clasificacionEdad) {
        this.clasificacionEdad = clasificacionEdad;
    }

    public LocalDate getFechaEstreno() {
        return fechaEstreno;
    }

    public void setFechaEstreno(LocalDate fechaEstreno) {
        this.fechaEstreno = fechaEstreno;
    }

    public int getDuracion() {
        return duracion;
    }

    public void setDuracion(int duracion) {
        this.duracion = duracion;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getActores() {
        return actores;
    }

    public void setActores(String actores) {
        this.actores = actores;
    }

    public String getSinopsis() {
        return sinopsis;
    }

    public void setSinopsis(String sinopsis) {
        this.sinopsis = sinopsis;
    }

    public String getCartel() {
        return cartel;
    }

    public void setCartel(String cartel) {
        this.cartel = cartel;
    }

    public Double getCalificacionImdb() {
        return calificacionImdb;
    }

    public void setCalificacionImdb(Double calificacionImdb) {
        this.calificacionImdb = calificacionImdb;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }
}