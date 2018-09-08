#include <cppcms/application.h>  
#include <cppcms/applications_pool.h>  
#include <cppcms/service.h>  
#include <cppcms/http_response.h>  
#include <cppcms/url_dispatcher.h>  
#include <cppcms/url_mapper.h>  
#include <fstream>  
#include <iostream>  
#include <stdlib.h>  
#include <stdio.h>  

class server : public cppcms::application {  
    public:  

        server(cppcms::service &srv) :  cppcms::application(srv)  {  
            // dispatcher().assign("/some/files/(.*)",&server::serve_file,this,1);
            // dispatcher().assign("/(.*)",&server::serve_file,this,1);
            // dispatcher().assign("/.*)",&server::serve_file,this,1);
            
            // dispatcher().assign("/*.js",&server::js,this,1);
            // dispatcher().assign("/(.*)",&server::index,this);
            std::cout << "-in server" << std::endl;


            dispatcher().assign("/?",&server::index,this);
            mapper().assign("index","/");
            
            dispatcher().assign("/(.*)",&server::api,this,1);
            mapper().assign("api","/");
            
            std::cout << "-in server end" << std::endl;
        }  
        

        void api(std::string file_name) {  
            std::cout << "api_start: " << file_name << std::endl;
        }  

        void index() {  
            std::cout << "index_start" << std::endl;
            
            std::ifstream f("./res/index.html");  
            if(!f) {  
                response().status(404);
            } else {  
                response().content_type("text/HTML");  
                response().out() << f.rdbuf();  
            }  
        }  

        virtual void main(std::string path) {
            cppcms::application::main(path);
        }

        // void js(std::string file_name) {  
        //     std::cout << "js_start" << std::endl;
            
        //     std::ifstream f(("./res/js/" + file_name).c_str());  
        //     if(!f) {  
        //         response().status(404);
        //     } else {  
        //         response().content_type("text/javascript");  
        //         response().out() << f.rdbuf();  
        //     }  
        // }  

        // void serve_file(std::string file_name) {  
        //     std::ifstream f("./res/index.html");  

        //     if(!f) {  
        //         response().status(404);
        //     } else {  
        //         response().content_type("application/octet-stream");  
        //         response().out() << f.rdbuf();  
        //     }  
        // }  
  
};  


int main(int argc,char ** argv) {  

    try {  
        cppcms::service srv(argc,argv); 
        srv.applications_pool().mount(  
            cppcms::applications_factory<server>()  
        ); 

        srv.run();  
    }  
    catch(std::exception const &e) {  
        std::cerr << e.what() << std::endl;  
    } 

}