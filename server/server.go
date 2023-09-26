package main

import (
	ConcertAPI "ConcertAPI/handlers"
	"net/http"
	"fmt"
	"log"
)

func main() {
	ConcertAPI.Parse()
	var r ConcertAPI.Router
	fmt.Println("Server runing on port 4200, goto localhost:4200")
	err := http.ListenAndServe(":4200", &r)
	if err != nil {
		log.Fatal(err) //* logging any errors in the terminal
	}
}
