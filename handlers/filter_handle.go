package ConcertAPI

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"
)

var allArtists []Data

// Filter by band method
func FilterBands(w http.ResponseWriter, r *http.Request) {

	r.ParseForm()
	creationFrom := r.FormValue("creation-date-from")
	creationTo := r.FormValue("creation-date-to")
	//creationFrom_int, _ := strconv.Atoi(creationFrom)
	//creationTo_int, _ := strconv.Atoi(creationTo)

	albumFrom := r.FormValue("first-album-date-from")
	albumTo := r.FormValue("first-album-date-to")
	// albumFrom_int, _ := strconv.Atoi(albumFrom)
	// albumTo_int, _ := strconv.Atoi(albumTo)

	membersFrom := r.FormValue("members-from")
	membersTo := r.FormValue("members-to")

	countriesIn := r.FormValue("countries")

	var filteredArtists []Data
	var rangeOver []Data
	firstSearch := true

	if creationFrom != "" && creationTo != "" {
		rangeOver = getFilteredArtists(&filteredArtists, firstSearch)
		creationDate(creationFrom, creationTo, &filteredArtists, &rangeOver)
		firstSearch = false
	}
	if albumFrom != "" && albumTo != "" {
		rangeOver = getFilteredArtists(&filteredArtists, firstSearch)
		firstAlbum(albumFrom, albumTo, &filteredArtists, &rangeOver)
		firstSearch = false
	}
	if membersFrom != "" && membersTo != "" {
		rangeOver = getFilteredArtists(&filteredArtists, firstSearch)
		members(membersFrom, membersTo, &filteredArtists, &rangeOver)
		firstSearch = false
	}
	if countriesIn != "" {
		rangeOver = getFilteredArtists(&filteredArtists, firstSearch)
		countries(countriesIn, &filteredArtists, &rangeOver)
		firstSearch = false
	}

	b, err := json.Marshal(filteredArtists)
	if err != nil {
		log.Println("Error during json marshlling. Error:", err)
	}
	w.Write(b)

}

func creationDate(from, to string, filteredArtists, rangeOver *[]Data) {
	fromInt, _ := strconv.Atoi(from)
	toInt, _ := strconv.Atoi(to)

	for _, art := range *rangeOver {
		if (art.CreationDate >= fromInt) && (art.CreationDate <= toInt) {
			*filteredArtists = append(*filteredArtists, FetchData(art.BandId-1))
		}
	}
}

func firstAlbum(from, to string, filteredArtists, rangeOver *[]Data) {
	fromInt, _ := strconv.Atoi(from)
	toInt, _ := strconv.Atoi(to)

	for _, art := range *rangeOver {
		spl := strings.Split(art.FirstAlbum, "-")
		if len(spl) <= 1 {

			return
		}
		date, _ := strconv.Atoi(spl[2])
		if (date >= fromInt) && (date <= toInt) {
			*filteredArtists = append(*filteredArtists, FetchData(art.BandId-1))
		}
	}
}

func members(from, to string, filteredArtists, rangeOver *[]Data) {
	fromInt, _ := strconv.Atoi(from)
	toInt, _ := strconv.Atoi(to)
	for _, art := range *rangeOver {
		if (len(art.Members) >= fromInt) && (len(art.Members) <= toInt) {
			*filteredArtists = append(*filteredArtists, FetchData(art.BandId-1))
		}
	}
}

func countries(country string, filteredArtists, rangeOver *[]Data) {
	spl := strings.Split(country, ",")
	for _, c := range spl {
		for _, art := range *rangeOver {
			for _, loc := range art.Locations {
				if strings.Contains(loc, c) {
					*filteredArtists = append(*filteredArtists, FetchData(art.BandId-1))
					break
				}
			}
		}
	}
}

func getFilteredArtists(filteredArtists *[]Data, firstSearch bool) []Data {
	var data []Data
	if !firstSearch {
		data = *filteredArtists
		*filteredArtists = nil
	} else {
		if len(allArtists) == 0 {
			for pers := range inputs.Artists {
				allArtists = append(allArtists, FetchData(pers))
			}
		}
		data = allArtists
	}
	return data
}
