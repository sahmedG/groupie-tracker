package ConcertAPI

import (
	"html/template"
	"net/http"
)

var indexTpl *template.Template

// Load the bands template page
func Bands(w http.ResponseWriter, r *http.Request) {

	indexTpl = template.Must(template.ParseGlob("../html/templates/*.html"))
	indexTpl.ExecuteTemplate(w, "bands.html", nil)

}
