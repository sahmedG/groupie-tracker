package ConcertAPI

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// * Search function
func FindBand(w http.ResponseWriter, r *http.Request) {

	var dataArr []Data
	var data Data

	var currIndex int
	dataArrIndexCounter := 0

	//convert everything to lower case to ease search algorithm
	searchingFor := strings.ToLower(r.FormValue("search"))
    fmt.Println(searchingFor)
	for pers, art := range inputs.Artists {
		MatchedOn := ""
		PossibleResults := ""
		//search for artists by the group name
		if strings.Contains(strings.ToLower(art.Name), searchingFor) {
			data = FetchData(pers)
			dataArr = append(dataArr, data)
			currIndex++
			MatchedOn += "Group name: " + art.Name
			PossibleResults += art.Name
			//search for Founded ons
		} else if strings.Contains(strconv.Itoa(art.CreationDate), searchingFor) {
			if len(dataArr) >= 1 {
				if dataArr[currIndex-1].Name != art.Name {
					data = FetchData(pers)
					MatchedOn += "Founded on: " + strconv.Itoa(art.CreationDate)
					PossibleResults += strconv.Itoa(art.CreationDate)
					dataArr = append(dataArr, data)
					currIndex++
				} else {
					if !strings.Contains(MatchedOn, "Founded on: ") {
						MatchedOn += ", Founded on: " + strconv.Itoa(art.CreationDate)
					}
				}
			} else {
				data = FetchData(pers)
				MatchedOn += "Founded on: " + strconv.Itoa(art.CreationDate)
				PossibleResults += strconv.Itoa(art.CreationDate)
				dataArr = append(dataArr, data)
				currIndex++
			}
		} else {
			myDate, _ := time.Parse("02-01-2006 15:04", art.FirstAlbum+" 04:35")
			if strings.Contains(myDate.Format("02/01/2006"), searchingFor) || strings.Contains(art.FirstAlbum, searchingFor) {
				if len(dataArr) >= 1 {
					if dataArr[currIndex-1].Name != art.Name {
						data = FetchData(pers)
						MatchedOn += "First album: " + art.FirstAlbum
						PossibleResults += art.FirstAlbum
						dataArr = append(dataArr, data)
						currIndex++
					} else {
						if !strings.Contains(MatchedOn, "First album: ") {
							MatchedOn += ", First album: " + art.FirstAlbum
						}
					}
				} else {
					data = FetchData(pers)
					MatchedOn += "First album: " + art.FirstAlbum
					PossibleResults += art.FirstAlbum
					dataArr = append(dataArr, data)
					currIndex++
				}
			}
		}
		//search for members
		for _, member := range art.Members {
			if strings.Contains(strings.ToLower(member), searchingFor) {
				if len(dataArr) >= 1 {
					fmt.Println(dataArr[currIndex-1].Name)
					if dataArr[currIndex-1].Name != art.Name {
						data = FetchData(pers)
						MatchedOn += "Member name: " + member
						PossibleResults += member
						dataArr = append(dataArr, data)
						currIndex++
					} else {
						if !strings.Contains(MatchedOn, "Member name: ") {
							MatchedOn +=", Member name: " +member
						} else {
							break
						}
					}
				} else {
					data = FetchData(pers)
					MatchedOn += "Member name: " + member
					PossibleResults += member
					dataArr = append(dataArr, data)
					currIndex++
				}
			}
		}

		for _, location := range inputs.Locations.Index[art.ID-1].Locations {
			location = (strings.ToLower(location))

			location = strings.Replace(location, "_", " ", -1)
			if strings.Contains(location, searchingFor) {
				if len(dataArr) >= 1 {
					if dataArr[currIndex-1].Name != art.Name {
						data = FetchData(pers)
						MatchedOn += "Location: " + location
						PossibleResults += location
						dataArr = append(dataArr, data)
						currIndex++
					} else {
						if !strings.Contains(MatchedOn, "Location: ") {
							MatchedOn += ", Location: " + location
						} else {
							break
						}
					}
				} else {
					data = FetchData(pers)
					dataArr = append(dataArr, data)
					MatchedOn += "Location: " + location
					PossibleResults += location
					currIndex++
				}
			}
		}
		if MatchedOn != "" {
			data.MatchedOn = append(data.MatchedOn, MatchedOn)
			dataArr[dataArrIndexCounter].MatchedOn = data.MatchedOn
			data.PossibleResults = append(data.PossibleResults, PossibleResults)
			dataArr[dataArrIndexCounter].PossibleResults = data.PossibleResults
			dataArrIndexCounter++
		}
	}
	b, err := json.Marshal(dataArr)
	if err != nil {
		ServeError(w, r, 500)
	}
	w.Write(b)
}
