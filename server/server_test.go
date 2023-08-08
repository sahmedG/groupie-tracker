package main

import (
	ConcertAPI "ConcertAPI/handlers"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
)

// var r ConcertAPI.Router

func TestServeHTTP(t *testing.T) {

	methods := []string{"GET", "POST"}
	paths := []string{"/", "/bands", "/w","/find","/geocode","/filter"}
	for _, m := range methods {
		for _, p := range paths {
			t.Run(fmt.Sprint("request method=>",m,"    ","path=>",p,"    "), func(t *testing.T) {
				// create a mock request
				req := httptest.NewRequest(m, p, nil)

				// create a mock response recorder
				rr := httptest.NewRecorder()

				// create a new router instance
				router := &ConcertAPI.Router{}

				// call the ServeHTTP function with the mock request and response recorder
				router.ServeHTTP(rr, req)

				// check the response status code
				if rr.Code != http.StatusOK {
					t.Errorf("handler returned wrong status code: got %v want %v",
						rr.Code, http.StatusOK)
				} else {
					t.Logf("handler returned correct status code: got %v want %v",
					rr.Code, http.StatusOK)
				}
			})
		}
	}
}
