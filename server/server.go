package main

import (
	ConcertAPI "ConcertAPI/handlers"
	"net/http"
)

func main() {
	ConcertAPI.Parse()
	var r ConcertAPI.Router
	http.ListenAndServe(":8080", &r)
}