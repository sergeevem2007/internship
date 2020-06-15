package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

var inputPath, resultPath string

func main() {

	fmt.Println(`Введите путь к файлу с адресами в формате "path/" `)
	fmt.Scan(&inputPath)
	fmt.Println(`Введите путь к папке результатов "path/" `)
	fmt.Scan(&resultPath)
	os.Mkdir(resultPath, 0700)
	for _, elem := range parseInput() {
		parsePage(elem)
	}
}

//открываем файл, читаем из файла и результат записываем в срез
func parseInput() []string {
	os.Chdir(inputPath)
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

	os.Chdir("../" + resultPath)
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
