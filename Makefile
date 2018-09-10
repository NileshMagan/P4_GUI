

build:
	c++ server.cpp -lcppcms -o server
run:
	./server -c config.js

clean:
	rm server



LIBS=-lcppcms -lbooster

uploader: server.cpp content.h
	$(CXX) -Wall $(CXXFLAGS) server.cpp -o server $(LIBS)
	


all: build run
allu: uploader run