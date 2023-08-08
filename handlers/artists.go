package ConcertAPI

import (
	"encoding/json"
	"net/http"
)

// function that being called when page is reloaded, or search result is clicked
func GetBands(w http.ResponseWriter, r *http.Request) {
	var dataArr []Data
	for id := 0; id < 52; id++ {
		dataArr = append(dataArr, FetchData(id))
	}
	b, err1 := json.Marshal(dataArr)
	if err1 != nil {
		ServeError(w, r,500)
	}
	w.Write(b)
}

func FetchData(id int) Data {
	return Data{
		BandId:         inputs.Artists[id].ID,
		Image:          inputs.Artists[id].Image,
		Name:           inputs.Artists[id].Name,
		Members:        inputs.Artists[id].Members,
		CreationDate:   inputs.Artists[id].CreationDate,
		FirstAlbum:     inputs.Artists[id].FirstAlbum,
		LocationsLink:  inputs.Artists[id].Locations,
		ConcertDates:   inputs.Artists[id].ConcertDates,
		Relations:      inputs.Artists[id].Relations,
		Locations:      inputs.Locations.Index[id].Locations,
		LocationsDates: inputs.Locations.Index[id].Dates,
		Dates:          inputs.Dates.Index[id].Dates,
		RelationStruct: inputs.Relation.Index[id].DatesLocations,
		JSONLen:        len(inputs.Artists),
	}
}
