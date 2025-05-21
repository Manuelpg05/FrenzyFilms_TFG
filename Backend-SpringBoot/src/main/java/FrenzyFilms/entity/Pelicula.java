package FrenzyFilms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.util.Set;

import org.hibernate.validator.constraints.URL;

@Entity
public class Pelicula extends DomainEntity {

    // Atributos recogidos de la BD de TMDB

    @NotBlank
    private String titulo;

    @NotBlank
    private String clasificacionEdad;

    @Column(nullable = false)
    private LocalDate fechaEstreno;

    @Column(nullable = false)
    private int duracion;

    @NotBlank
    private String genero;

    @NotBlank
    private String director;

    @Column(length = 2048)
    @NotBlank
    private String actores;

    @Column(length = 2048)
    @NotBlank
    private String sinopsis;

    @URL
    @NotBlank
    private String cartel;

    @URL
    @NotBlank
    private String banner;

    @Column(nullable = false, unique = true)
    private int tmdbId;

    @Column(nullable = false)
    private double calificacionTmdb;

    // Atributos propios
    private Estado estado;

    @OneToMany
    @JoinColumn(name = "pelicula_id")
    private Set<Sesion> sesiones;

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

    public String getClasificacionEdad() {
        return clasificacionEdad;
    }

    public void setClasificacionEdad(String clasificacionEdad) {
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

    public String getBanner() {
        return banner;
    }

    public void setBanner(String banner) {
        this.banner = banner;
    }

    public int getTmdbId() {
        return tmdbId;
    }

    public void setTmdbId(int tmdbId) {
        this.tmdbId = tmdbId;
    }

    public Double getCalificacionTmdb() {
        return calificacionTmdb;
    }

    public void setCalificacionTmdb(Double calificacionTmdb) {
        this.calificacionTmdb = calificacionTmdb;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    public Set<Sesion> getSesiones() {
        return sesiones;
    }

    public void setSesiones(Set<Sesion> sesiones) {
        this.sesiones = sesiones;
    }
}