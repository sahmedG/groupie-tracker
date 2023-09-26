package ConcertAPI

import (
	"net/http"
	"strings"
)

// Handle all requests
func (r *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	Path := req.URL.Path
	Method := req.Method

	if Path == "/" {
		if Method == "GET" {
			Index(w, req)
		} else {
			w.WriteHeader(http.StatusBadRequest)
			ServeError(w, req, 400)
		}
	} else if Path == "/bands" {
		if Method == "GET" {
			Bands(w, req)
		} else {
			w.WriteHeader(http.StatusBadRequest)
			ServeError(w, req, 400)
		}
	} else if strings.Contains(Path, "/static") {
		if Method == "GET" {
			filename := strings.ReplaceAll(req.URL.Path, "/static/", "")
			StaticFiles(w, req, filename)
		} else {
			w.WriteHeader(http.StatusBadRequest)
			ServeError(w, req, 400)
		}
	} else if strings.Contains(Path, "/css") {
		if Method == "GET" {
			filename := strings.ReplaceAll(req.URL.Path, "/css/", "")
			StylesServ(w, req, filename)
		} else {
			w.WriteHeader(http.StatusBadRequest)
			ServeError(w, req, 400)
		}
	} else if strings.Contains(Path, "/js") {
		if Method == "GET" {
			filename := strings.ReplaceAll(req.URL.Path, "/js/", "")
			ScriptsServ(w, req, filename)
		} else {
			w.WriteHeader(http.StatusBadRequest)
			ServeError(w, req, 400)
		}
	} else if Path == "/filter" {
		if Method == "POST" {
			FilterBands(w, req)
		} else {
			w.WriteHeader(http.StatusBadRequest)
			ServeError(w, req, 400)
		}
	} else if Path == "/geocode" {
		if Method == "POST" {
			FetchLocCode(w, req)
		} else {
			w.WriteHeader(http.StatusBadRequest)
			ServeError(w, req, 400)
		}
	} else if Path == "/artists" {
		if Method == "POST" {
			GetBands(w, req)
		} else {
			w.WriteHeader(http.StatusBadRequest)
			ServeError(w, req, 400)
		}
	} else if Path == "/find" {
		if Method == "POST" {
			FindBand(w, req)
		} else {
			w.WriteHeader(http.StatusBadRequest)
			ServeError(w, req, 400)
		}
	} else if Path == "/favicon.ico" {
		filename := "favicon.ico"
		ScriptsServ(w, req, filename)
	} else {
		w.WriteHeader(http.StatusNotFound)
		ServeError(w, req, 404)
	}
}
