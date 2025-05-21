package FrenzyFilms.dto;

import java.util.List;

public class TmdbCreditsResponse {

    private List<Cast> cast;
    private List<Crew> crew;

    public static class Cast {
        private String name;

        public Cast() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class Crew {
        private String job;
        private String name;

        public Crew() {}

        public String getJob() { return job; }
        public void setJob(String job) { this.job = job; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public TmdbCreditsResponse() {}

    public List<Cast> getCast() { return cast; }
    public void setCast(List<Cast> cast) { this.cast = cast; }

    public List<Crew> getCrew() { return crew; }
    public void setCrew(List<Crew> crew) { this.crew = crew; }
}
