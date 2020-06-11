package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

func main() {
	input, err := os.Open("input.txt")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(input)

	linkPage := "https://www.google.com/"
	parsePage(linkPage)
}

func parsePage(link string) {
	page, err := http.Get(link)
	if err != nil {
		fmt.Println(err)
		return
	}
	pageContent, err := ioutil.ReadAll(page.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer page.Body.Close()

	file, err := os.Create("link.html")
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	defer file.Close()
	file.Write(pageContent)
	return
}
