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
        
        // Method that handles initialisation and routing for APIs
        server(cppcms::service &srv) :  cppcms::application(srv)  { 

            std::cout << "- Routing to API" << std::endl;
            // Route any requests with '/saveImage' to the 'saveImage' API
            dispatcher().assign("/(.*)",&server::saveImage,this,1);
            
        }  
        
        // API request to save image - parameter not used. Need to figure out correct param
        void saveImage(std::string h) {  
            std::cout << "- Starting saveImage API "  << std::endl;

            // Process input
            content::upload c;
            if(request().request_method()=="POST") {
                std::cout << "- Request was POSTed successfully " << std::endl;
                c.info.load(context());
                if(c.info.validate()) {
                    
                    // Create name for image
                    std::string new_name = "latest_image1";

                    // Check mimetype of image in
                    if(c.info.image.value()->mime() == "image/png")
                        new_name += ".png";
                    else
                        new_name += ".jpg"; // we had validated mime-type
                    
                    std::cout << "- Request valid, image saved " << std::endl;

                    // Save image to /uploads/ folder
                    c.info.image.value()->save_to("./uploads/" + new_name); 
                    c.info.clear();

                    // TODO:
                    //
                    // Josh can add code here for UART
                }
            }
            std::cout << "- Ending saveImage API " << std::endl;
        }  

        // Default method that runs every time (it seems)
        virtual void main(std::string path) {
            
            std::cout << "+++++ Server request started" << std::endl;
            cppcms::application::main(path);
            std::cout << "----- Server request finished" << std::endl;
        }

  
};  


int main(int argc,char ** argv) {  

    // Server set up
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