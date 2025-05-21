package FrenzyFilms.dto;

import java.util.List;

public class TmdbReleaseDatesResponse {

    private int id;
    private List<CountryRelease> results;

    public static class CountryRelease {
        private String iso_3166_1;
        private List<Release> release_dates;

        public String getIso_3166_1() {
            return iso_3166_1;
        }

        public void setIso_3166_1(String iso_3166_1) {
            this.iso_3166_1 = iso_3166_1;
        }

        public List<Release> getRelease_dates() {
            return release_dates;
        }

        public void setRelease_dates(List<Release> release_dates) {
            this.release_dates = release_dates;
        }
    }

    public static class Release {
        private String certification;

        public String getCertification() {
            return certification;
        }

        public void setCertification(String certification) {
            this.certification = certification;
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public List<CountryRelease> getResults() {
        return results;
    }

    public void setResults(List<CountryRelease> results) {
        this.results = results;
    }
}
