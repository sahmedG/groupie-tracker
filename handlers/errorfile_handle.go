package ConcertAPI

import "net/http"

// Handling Web Server errors
func ServeError(w http.ResponseWriter, r *http.Request,err int){
	switch err {
	case 400:
		http.ServeFile(w, r, "../html/404/400.html")
	case 404:
		http.ServeFile(w, r, "../html/404/404.html")
	case 500:
		http.ServeFile(w, r, "../html/404/500.html")
	}

}
