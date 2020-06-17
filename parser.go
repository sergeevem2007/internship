package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"regexp"
	"strings"
)

func main() {
	inputPath := flag.String("input", "input/input.txt", "path to input file")
	resultPath := flag.String("result", "result", "path to result")
	flag.Parse()
	err := os.Mkdir(*resultPath, 0700)
	if err != nil {
		fmt.Println(err)
		return
	}

	for _, link := range parseInput(*inputPath) {
		parsePage(link, *resultPath)
	}
}

//открываем файл, читаем из файла и результат записываем в срез
func parseInput(path string) []string {
	input, err := os.Open(path)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	defer input.Close()

	inputContent, err := ioutil.ReadAll(input)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	return strings.Split(string(inputContent), "\r\n")
}

//отправляем запрос, из тела ответа читаем данные, создаем директорию, переходим в директорию,
//создаем файл, запсисываем данные в файл, выходим из директории
func parsePage(link, path string) {

	page, err := http.Get(link)
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

	link = regexp.MustCompile(`([a-z]*)://`).ReplaceAllString(link, "")
	link = regexp.MustCompile(`[\/?:"<>|+*]`).ReplaceAllString(link, "")

	err = os.Chdir(path)
	if err != nil {
		fmt.Println(err, "1")
		return
	}

	err = os.Mkdir(link, 0700)
	if err != nil {
		fmt.Println(err)
		return
	}

	err = os.Chdir(link + "/")
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

	_, err = file.Write(pageContent)
	if err != nil {
		fmt.Println(err)
		return
	}

	err = os.Chdir("../../")
	if err != nil {
		fmt.Println(err)
		return
	}
	return
}
