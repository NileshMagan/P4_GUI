# COMPILE & RUN
* Uses CPPCMS-1.2.1 version
* Runs by default on port 8080 (localhost:8080)

Compile and run with Makefile
```
make all
```

No Makefile (probably doesnt work now UART code is included!)
```
c++ server.cpp -lcppcms -o server
./server -c config.js
```


# NEED TO RUN THESE BEFORE STARTING SERVER
This export:

```
sudo chmod o+rw /dev/ttyS5
export LD_LIBRARY_PATH=/usr/local/lib
```


