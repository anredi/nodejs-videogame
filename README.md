TÍTULO DEL PROYECTO:

VIDEOJUEGO DE NAVEGADOR BASADO EN CANVAS 2D, PHONEGAP Y
WEBSOCKETS EN NODE.JS

Autor: Antonio Rey Díaz

Este proyecto consiste en un videojuego de navegador.

El backend (parte servidor) está desarrollado con Node JS (lenguaje JavaScript en el servidor), usando los paquetes de Node "Express" (el cual es un servidor web escrito en JavaScript) y "Socket.io" (el cual permite usar websockets para la comunicacion entre backend y frontend).

Los datos de las partidas (partidas ganadas, perdidas, etc) se guardan usando MongoDB, un gestor de base de datos que permite usar un modelo no relacional de almacenamiento de datos, el cual permite leer mucho más rápido las estadísticas de partidas guardadas.

El frontend usa Canvas 2D, que permite dibujar los gráficos del videojuego usando JavaScript. También está preparado para ser ejecutado en un móvil Android usando Phonegap.

Todo lo relacionado con el desarrollo de este software: análisis, diseño, implementación y pruebas, está documentado en el archivo "memoria.pdf", donde también existe un manual de instalación y de uso.
