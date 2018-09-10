# COMPILE & RUN
* Uses CPPCMS-1.2.1 version
* Runs by default on port 8080

Compile and run with Makefile
```
make allu
```

No Makefile
```
c++ server.cpp -lcppcms -o server
./server -c config.js
```


# MAY NEED
This export:

```
export LD_LIBRARY_PATH=/usr/local/lib
```


