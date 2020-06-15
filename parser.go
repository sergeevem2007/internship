package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

func main() {
	inputPath := flag.String("input", "input/input.txt", "path to input file")
	resultPath := flag.String("result", "result/", "path to result")
	flag.Parse()
	os.Mkdir(*resultPath, 0700)
	for _, elem := range parseInput(*inputPath) {
		parsePage(elem, *resultPath)
	}
}

//открываем файл, читаем из файла и результат записываем в срез
func parseInput(path string) []string {
	// os.Chdir(path)
	input, err := os.Open(path)
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

//отправляем запрос, из тела ответа читаем данные, создаем директорию, переходим в директорию,
//создаем файл, запсисываем данные в файл, выходим из директории
func parsePage(link, path string) {
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

	os.Chdir(path)
	os.Mkdir(link, 0700)
	os.Chdir(link + "/")
	file, err := os.Create(link + ".html")
	defer file.Close()
	if err != nil {
		fmt.Println(err)
		return
	}
	file.Write(pageContent)
	os.Chdir("../")
	return
}
