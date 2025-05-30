package FrenzyFilms.dto;

import java.util.List;

public class TmdbCreditsResponse {

    private List<Cast> cast;
    private List<Crew> crew;

    public static class Cast {
        private String name;
        private String character;
        private String profile_path;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCharacter() { return character; }
        public void setCharacter(String character) { this.character = character; }

        public String getProfile_path() { return profile_path; }
        public void setProfile_path(String profile_path) { this.profile_path = profile_path; }
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
