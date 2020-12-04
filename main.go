package main

import (
	"bufio"
	"bytes"
	"encoding/binary"
	"fmt"
	"log"
	"os"
	"strings"
	"unsafe"
)

type estudiante struct {
	Id        int64
	Siguiente int64
	Nombre    [25]byte
}

func main() {
	menu()
}

func menu() {
	var opcion = 0

	for {
		fmt.Println("---------------------------------------------------")
		fmt.Println("-----------------Escoja una opción-----------------")
		fmt.Println("---------------------------------------------------")
		fmt.Println("1. Crear archivo binario.")
		fmt.Println("2. Eliminar archivo binario.")
		fmt.Println("3. Crear estudiante.")
		fmt.Println("4. Leer estudiantes.")
		fmt.Println("5. Salir.")
		fmt.Scanf("%d\n", &opcion)

		switch opcion {
		case 1:
			crearArchivo()
			break
		case 2:
			eliminarArchivo()
			break
		case 3:
			crearEstudiante()
			break
		case 4:
			leerEstudiantes()
			break
		case 5:
			salir()
			break
		}

	}
}

func crearArchivo() {
	fmt.Println("-----Crear archivo binario-----")

	//variable para llevar control del tamaño del disco
	var size = 1

	//se procede a crear el archivo
	file, err := os.Create("estudiantes.bin")
	defer file.Close()
	if err != nil {
		log.Fatal(err)
	}

	//se crea una variable temporal con un cero que nos ayudará a llenar nuestro archivo de ceros lógicos
	var temporal int8 = 0
	s := &temporal
	var binario bytes.Buffer
	binary.Write(&binario, binary.BigEndian, s)

	/*
		se realiza un for para llenar el archivo completamente de ceros
		NOTA: Para esta parte se recomienda tener un buffer con 1024 ceros (ya que 1024 es la medida
		mínima a escribir) para que este ciclo sea más eficiente
	*/
	for i := 0; i < size*1024*1024; i++ {
		escribirBytes(file, binario.Bytes())
	}

	/*
		se escribira un estudiante por default para llevar el control.
		En el proyecto, el que nos ayuda a llevar el control de las
		particiones es el mbr
	*/

	//nos posicionamos al inicio del archivo usando la funcion Seek
	//Funcion Seek: https://ispycode.com/GO/Files-And-Directories/Seek-Positions-in-File
	file.Seek(0, 0)

	//Asignamos valores a los atributos del struct.
	estudianteTemporal := estudiante{Id: 1}
	estudianteTemporal.Siguiente = -1
	copy(estudianteTemporal.Nombre[:], "Ruth Lechuga")

	//Escribimos struct.
	var bufferEstudiante bytes.Buffer
	binary.Write(&bufferEstudiante, binary.BigEndian, &estudianteTemporal)
	escribirBytes(file, bufferEstudiante.Bytes())

	defer file.Close()
	fmt.Println("Archivo creado exitosamente!")
}

func eliminarArchivo() {
	fmt.Println("-----Eliminar archivo binario-----")

	err := os.Remove("estudiantes.bin")

	if err != nil {
		fmt.Println("Error al eliminar el archivo.")
	} else {
		fmt.Println("Archivo eliminado exitosamente!")
	}
}

func crearEstudiante() {
	fmt.Println("-----Crear estudiante-----")

	//Toma los datos de entrada del usuario
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("Ingrese el nombre:")
	nombreEstudiante, _ := reader.ReadString('\n')
	nombreEstudiante = strings.TrimSpace(nombreEstudiante)

	//Abrimos el archivo con los permisos correspondientes
	file, err := os.OpenFile("estudiantes.bin", os.O_RDWR, 0777)
	defer file.Close()
	if err != nil {
		log.Fatal(err)
	}

	//Creamos una variable temporal que nos ayudará a leer los estudiantes
	estudianteTemporal := estudiante{}

	//obtenemos el size del estudiante, esto nos ayudara a establecer la posicion siguiente y cuantos bytes leeremos
	var size int = int(unsafe.Sizeof(estudianteTemporal))

	var posSiguiente int64 = 0
	var posInicialAnterior int64 = 0
	var contadorEstudiantes int64 = 0

	//iteramos hasta encontrar el apuntador a -1 (es decir cuando no haya un estudiante siguiente)
	for posSiguiente != -1 {
		posInicialAnterior = posSiguiente
		contadorEstudiantes++

		file.Seek(posSiguiente, 0)
		estudianteTemporal = leerEstudiante(file, size, estudianteTemporal)
		posSiguiente = estudianteTemporal.Siguiente
	}

	/*
		escribimos el nodo anterior actualizando el valor del siguiente
	*/
	//1. Actualizamos el atributo siguiente
	estudianteTemporal.Siguiente = posInicialAnterior + int64(size)
	//2. Nos movemos de nuevo a la posicion del anterior
	file.Seek(posInicialAnterior, 0)
	//3. Lo rescribimos
	var bufferEstudiante bytes.Buffer
	binary.Write(&bufferEstudiante, binary.BigEndian, &estudianteTemporal)
	escribirBytes(file, bufferEstudiante.Bytes())

	//4. Creamos el nuevo struct
	estudianteNuevo := estudiante{Id: contadorEstudiantes + 1}
	estudianteNuevo.Siguiente = -1
	copy(estudianteNuevo.Nombre[:], nombreEstudiante)
	//5 movemos el puntero a la nueva posicion
	file.Seek(estudianteTemporal.Siguiente, 0)
	//6. Escribimos el nuevo struct
	var bufferNuevo bytes.Buffer
	binary.Write(&bufferNuevo, binary.BigEndian, &estudianteNuevo)
	escribirBytes(file, bufferNuevo.Bytes())

	fmt.Println("Estudiante creado exitosamente!")
}

func leerEstudiantes() {
	fmt.Println("-----Leer estudiantes-----")

	//Abrimos el archivo.
	file, err := os.Open("estudiantes.bin")
	defer file.Close()
	if err != nil {
		log.Fatal(err)
	}

	//Creamos una variable temporal que nos ayudará a leer los estudiantes
	estudianteTemporal := estudiante{}
	//obtenemor el size del estudiante para saber cuantos bytes leer
	var size int = int(unsafe.Sizeof(estudianteTemporal))

	var posSiguiente int64 = 0

	for posSiguiente != -1 {
		file.Seek(posSiguiente, 0)
		estudianteTemporal = leerEstudiante(file, size, estudianteTemporal)
		posSiguiente = estudianteTemporal.Siguiente
		fmt.Printf("ID: %d => Nombre: %s => Siguiente: %v \n", estudianteTemporal.Id, estudianteTemporal.Nombre, estudianteTemporal.Siguiente)
	}
	defer file.Close()
}

func leerEstudiante(file *os.File, size int, estudianteTemporal estudiante) estudiante {
	//Lee la cantidad de <size> bytes del archivo
	data := leerBytes(file, size)

	//Convierte la data en un buffer,necesario para
	//decodificar binario
	buffer := bytes.NewBuffer(data)

	//Decodificamos y guardamos en la variable estudianteTemporal
	err := binary.Read(buffer, binary.BigEndian, &estudianteTemporal)
	if err != nil {
		log.Fatal("binary.Read failed", err)
	}

	//retornamos el estudiante
	return estudianteTemporal
}

func salir() {
	os.Exit(0)
}

func leerBytes(file *os.File, number int) []byte {
	bytes := make([]byte, number)

	_, err := file.Read(bytes)
	if err != nil {
		log.Fatal(err)
	}

	return bytes
}

func escribirBytes(file *os.File, bytes []byte) {
	_, err := file.Write(bytes)

	if err != nil {
		log.Fatal(err)
	}
}
