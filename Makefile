# build:
	# c++ server.cpp -lcppcms -o server
# run:
	# ./server -c config.js

# clean:
	# rm server

# LIBS= -lcppcms -lbooster -lm -lpthread -lX11
	
# uploader: server.cpp content.h 
	# $(CXX) -Wall $(CXXFLAGS) server.cpp -o server $(LIBS)

# all: build run
# allu: uploader run

TARGET = server
LIBS = -lcppcms -lbooster -lm -lpthread -lX11
CC = g++ -std=c++11
CFLAGS = -g -Wall 

.PHONY: default all clean run

default: $(TARGET)
all: default run

OBJECTS = $(patsubst %.c, %.o, $(wildcard *.cpp))
HEADERS = $(wildcard *.h)

%.o: %.c $(HEADERS)
	$(CC) $(CFLAGS) -c $< -o $@

.PRECIOUS: $(TARGET) $(OBJECTS)

$(TARGET): $(OBJECTS)
	$(CC) $(OBJECTS) -Wall $(LIBS) -o $@

clean:
	-rm -f *.o
	#-rm -f $(TARGET)
	
run:
	export LD_LIBRARY_PATH=/usr/local/lib
	sudo chmod o+rw /dev/ttyS4
	stty -F /dev/ttyS4 9600
	./$(TARGET) -c config.js