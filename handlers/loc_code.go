package ConcertAPI

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
)

var allGeodata Geodata

// Produce GeoLocation
func FetchLocCode(w http.ResponseWriter, r *http.Request) {

	type Country struct {
		Name   string
		Coords []string
	}

	var response []Country
	var country Country

	jsonFile, err := os.Open("../handlers/data/loc_codes.json")
	if err != nil {
		log.Println("Error:", err)
	}
	jsonData, err := io.ReadAll(jsonFile)
	if err != nil {
		log.Println(err)
	}
	defer jsonFile.Close()
	json.Unmarshal(jsonData, &allGeodata)
	request := strings.Split(r.FormValue("query"), ",")

	for _, loc := range request {
		for _, coord := range allGeodata.Index {
			if _, ok := coord.CountryCoords[loc]; ok {
				country.Name = loc
				country.Coords = coord.CountryCoords[loc]
				response = append(response, country)
				break
			}
		}
	}

	b, err := json.Marshal(response)
	if err != nil {
		log.Println("Error during json marshlling. Error:", err)
	}
	w.Write(b)

}
