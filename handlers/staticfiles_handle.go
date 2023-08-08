package ConcertAPI

import (
	"net/http"
)

//* serve all static files
func StaticFiles(w http.ResponseWriter, req *http.Request,filename string) {
	switch filename{
	//! Not needed!
	case "Concert.jpg":
		http.ServeFile(w, req, "../html/static/Concert.jpg")
	case "sad.png":
		http.ServeFile(w, req, "../html/static/sad.png")
	case "floyd.jpeg":
		http.ServeFile(w, req, "../html/static/floyd.css")
	case "concert.jpeg":
		http.ServeFile(w, req, "../html/static/concert.jpeg")
	case "calendar.svg":
		http.ServeFile(w, req, "../html/static/calendar.svg")
	case "favicon.ico":
		http.ServeFile(w, req, "../html/static/favicon.ico")
	case "Norse-Bold.otf":
		http.ServeFile(w, req, "../html/static/Norse-Bold.otf")
	}

}
