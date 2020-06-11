package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

func main() {
	parseInput()
	a := parseInput()
	fmt.Println(a)
	for _, elem := range parseInput() {
		parsePage(elem)
	}
	// linkPage := "https://www.google.com/"
	// parsePage(linkPage)
}

func parseInput() []string {
	input, err := os.Open("input.txt")
	defer input.Close()

	if err != nil {
		fmt.Println(err)
	}

	inputContent, err := ioutil.ReadAll(input)
	if err != nil {
		fmt.Println(err)
	}

	return strings.Split(string(inputContent), "\r\n")
}

func parsePage(link string) {
	page, err := http.Get("http://" + link)
	if err != nil {
		fmt.Println(err)
		return
	}
	pageContent, err := ioutil.ReadAll(page.Body)
	defer page.Body.Close()

	if err != nil {
		fmt.Println(err)
		return
	}

	err = os.Mkdir(link, 1)
	if err != nil {
		fmt.Println(err)
		return
	}

	file, err := os.Create(link + ".html")
	if err != nil {
		fmt.Println(err)
		return
	}

	defer file.Close()

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	file.Write(pageContent)
	return
}
