FROM golang:1.20
LABEL authors="malsammak, akhaled, sahmed"
LABEL version="1.0"
COPY . /groupie-tracker
WORKDIR /groupie-tracker/server
RUN go build -v server.go
EXPOSE 8080
CMD ./server
