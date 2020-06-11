package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

func main() {
	for _, elem := range parseInput() {
		parsePage(elem)
	}
}

//открываем файл, читаем из файла и результат записываем в срез
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

//отправляем запрос, из тела ответа читаем данные, создаем директорию, переходим в директорию,
//создаем файл, запсисываем данные в файл, выходим из директории
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
