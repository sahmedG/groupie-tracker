package ConcertAPI

import (
	"net/http"
)

// serve index.html and its associated files
func Index(w http.ResponseWriter, req *http.Request) {

	http.ServeFile(w, req, "../html/templates/index.html")
	w.Header().Set("Content-Type", "text/html")

}
