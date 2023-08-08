#!/bin/bash

sudo fuser -k 8080/tcp
docker build -t groupie-tracker .
docker docker run -p 8080:8080 groupie-tracker
xdg-open http://localhost:8080
