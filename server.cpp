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
            
            std::cout << "-server" << std::endl;
            dispatcher().assign("/(.*)",&server::index,this);
            std::cout << "-server-mid" << std::endl;
            mapper().assign("index","/index"); 
            std::cout << "-server_end" << std::endl;
        }  

        //     // std::ifstream f(("./res/" + file_name).c_str());  
        void serve_file(std::string file_name) {  
            std::ifstream f("./res/index.html");  

            if(!f) {  
                response().status(404);
            } else {  
                response().content_type("application/octet-stream");  
                response().out() << f.rdbuf();  
            }  
        }  
        
        void index() {  
            // std::ifstream f(("./res/" + file_name).c_str());  
            std::cout << "index_start" << std::endl;
            
            std::ifstream f("./res/index.html");  
            if(!f) {  
                response().status(404);
            } else {  
                // response().content_type("application/octet-stream");  
                response().content_type("text/HTML");  
                response().out() << f.rdbuf();  
            }  
        }  

        // virtual void main(std::string url) {         
        //     std::cout << "main" << std::endl;
        //     response().out() <<  
        //         "<html>\n"  
        //         "<body>\n"  
        //         "  <h1>Hello World from server</h1>\n"  
        //         "</body>\n"  
        //         "</html>\n";  
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