#include <cppcms/application.h>  
#include <cppcms/applications_pool.h>  
#include <cppcms/service.h>  
#include <cppcms/http_response.h>  
#include <cppcms/url_dispatcher.h>  
#include <cppcms/url_mapper.h>  
#include <cppcms/http_file.h>
#include <fstream>  
#include <iostream>  
#include <stdlib.h>  
#include <stdio.h>  
#include "content.h"

class server : public cppcms::application {  
    public:  

        server(cppcms::service &srv) :  cppcms::application(srv)  { 
            std::cout << "-in server" << std::endl;


            // dispatcher().assign("/?",&server::index,this);
            // mapper().assign("index","/");

            // dispatcher().assign("/(.*)",&server::api,this,1);
            // mapper().assign("api","/");
            
            // dispatcher().assign("/api/(\\d+)",&server::api,this,1);  
            // mapper().assign("api","/api/{1}");  
            dispatcher().assign("/(.*)",&server::api,this,1);
            mapper().assign("api","/");
            
            std::cout << "-in server end" << std::endl;
        }  
        

        void api(std::string h) {  
            std::cout << "api_start "  << std::endl;


            content::upload c;
            if(request().request_method()=="POST") {
                std::cout << "post " << std::endl;
                c.info.load(context());
                if(c.info.validate()) {
                    
                     std::cout << "inside: " << std::endl;

                    std::string new_name = "latest_image1";
                    if(c.info.image.value()->mime() == "image/png")
                        new_name += ".png";
                    else
                        new_name += ".jpg"; // we had validated mime-type
                    //

                    c.info.image.value()->save_to("./uploads/" + new_name); 
                    c.info.clear();
                }
            }

            // render("upload",c);
            
            std::cout << "api_end: " << std::endl;
            // if(c.info.image.value()->mime() == "image/png") {
            //     std::cout << " IMAGE " << std::endl;
            // } else {
            //     std::cout << " NOT IMAGE " << std::endl;                
            // }


        }  

        // void index() {  
        //     std::cout << "index_start" << std::endl;
            
        //     std::ifstream f("./res/index.html");  
        //     if(!f) {  
        //         response().status(404);
        //     } else {  
        //         response().content_type("text/HTML");  
        //         response().out() << f.rdbuf();  
        //     }  
        // }  

        virtual void main(std::string path) {
            std::cout << "maaaaaiiiiiiiiiiin" << std::endl;
            
            cppcms::application::main(path);
        }

  
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