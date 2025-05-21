package FrenzyFilms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TmdbSearchResult {

    private int id;

    @JsonProperty("title")
    private String titulo;

    @JsonProperty("release_date")
    private String fechaEstreno;

    @JsonProperty("poster_path")
    private String cartel;

    private String overview;

    @JsonProperty("vote_average")
    private double puntuacion;

    public TmdbSearchResult() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getFechaEstreno() {
        return fechaEstreno;
    }

    public void setFechaEstreno(String fechaEstreno) {
        this.fechaEstreno = fechaEstreno;
    }

    public String getCartel() {
        return cartel;
    }

    public void setCartel(String cartel) {
        this.cartel = cartel;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public double getPuntuacion() {
        return puntuacion;
    }

    public void setPuntuacion(double puntuacion) {
        this.puntuacion = puntuacion;
    }
}
