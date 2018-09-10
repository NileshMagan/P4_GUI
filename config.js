{  
    "service" : {  
        "api" : "http",  
        "port" : 8080  
    },  
    "http" : {  
        // "script_names" : [ "/server" ]
        "script_names" : [ "/server" ],
        "rewrite" : [ 
            { "regex" : "/res(/.+)", "pattern" : "$1" },
            // { "regex" : ".*" , "pattern" : "/server$0" }
            { "regex" : "/saveImage" , "pattern" : "/server$0" }
            // { "regex" : "/r(/.+)", "pattern" : "$1" },
         ],  
    },
    // "views" : {
    //     "paths" : [ "./" ]
    //  },
    "file_server" : {
        "enable" : true,
        "listing" : true,
        "document_root" : "./res/"
     }  
}  