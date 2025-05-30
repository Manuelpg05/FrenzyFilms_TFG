package FrenzyFilms.dto;

import java.util.List;

public class TmdbSearchResponse {

    private int page;
    private List<TmdbSearchResult> results;
    private int total_results;
    private int total_pages;

    public TmdbSearchResponse() {}

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public List<TmdbSearchResult> getResults() {
        return results;
    }

    public void setResults(List<TmdbSearchResult> results) {
        this.results = results;
    }

    public int getTotal_results() {
        return total_results;
    }

    public void setTotal_results(int total_results) {
        this.total_results = total_results;
    }

    public int getTotal_pages() {
        return total_pages;
    }

    public void setTotal_pages(int total_pages) {
        this.total_pages = total_pages;
    }
}
