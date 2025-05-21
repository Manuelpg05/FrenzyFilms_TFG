package FrenzyFilms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class TmdbMovieDetail {

    private int id;

    @JsonProperty("title")
    private String titulo;

    @JsonProperty("release_date")
    private String fechaEstreno;

    @JsonProperty("runtime")
    private int duracion;

    private String overview;

    @JsonProperty("poster_path")
    private String cartel;

    @JsonProperty("backdrop_path")
    private String banner;

    @JsonProperty("vote_average")
    private double puntuacion;

    @JsonProperty("genres")
    private List<Genre> generos;

    public static class Genre {
        private int id;
        private String name;

        public Genre() {}

        public int getId() { return id; }
        public void setId(int id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public TmdbMovieDetail() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getFechaEstreno() { return fechaEstreno; }
    public void setFechaEstreno(String fechaEstreno) { this.fechaEstreno = fechaEstreno; }

    public int getDuracion() { return duracion; }
    public void setDuracion(int duracion) { this.duracion = duracion; }

    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }

    public String getCartel() { return cartel; }
    public void setCartel(String cartel) { this.cartel = cartel; }

    public String getBanner() { return banner; }
    public void setBanner(String banner) { this.banner = banner; }

    public double getPuntuacion() { return puntuacion; }
    public void setPuntuacion(double puntuacion) { this.puntuacion = puntuacion; }

    public List<Genre> getGeneros() { return generos; }
    public void setGeneros(List<Genre> generos) { this.generos = generos; }
}
