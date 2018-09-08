
build:
	c++ server.cpp -lcppcms -o server
run:
	./server -c config.js
	
all: build run