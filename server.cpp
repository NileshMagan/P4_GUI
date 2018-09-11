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
//includes for SW/HW neural network code
#include <unistd.h>
#include  "CImg.h"
#include <string>
#include "custom.h"
#include <time.h>

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

					//Below is code to send the image to HW and receive result
					FILE *fileW, *fileR;
					int imageForSw[28][28] = {0};
					int SwRes, HwRes;
					char seperator = ',';
					char responseBuffer[32], hwTimeBuffer[8];
					std::string imagePath = "uploads/latest_image1.png";
					
					//Using CImg open get the image sent from server
					int n = imagePath.length(); 
					char char_array[n+1]; 
					strcpy(char_array, imagePath.c_str()); 
					cimg_library::CImg<unsigned char> image(char_array);	
					
					//Open files to read/write to the serial port
					fileW = fopen("/dev/ttyS5", "w");
					fileR = fopen("/dev/ttyS5", "r");
					
					//Loop through the image and send it to HW over serial port
					for(int i = 0; i<28; i++){
						for(int j = 0; j<28; j++){
							//Account for the 8 pixel black border around the 20x20 image
							if((i < 4) || (i > 23) || (j < 4) || (j > 23)){
								fprintf(fileW, "%d", 0);
								imageForSw[i][j] = 0;
							}else{
								fprintf(fileW, "%d", *image.data(j-4,i-4));
								imageForSw[i][j] = *image.data(j-4,i-4);
							}
							fprintf(fileW, "%c", seperator);
						}
					}

					//Run a local SW implementation of the neural net and time
					clock_t start = clock();
					neural_net(&imageForSw, &SwRes);
					clock_t end = clock();
					double swTimeTaken = (double)(end-start)/CLOCKS_PER_SEC;
					
					//Send the SW result to HW for comparison
					fprintf(fileW, "%d", SwRes);
					fprintf(fileW, "%c", '!');		
					fclose(fileW);
					
					//read the response from HW
					fscanf(fileR, "%s" "%s", responseBuffer, hwTimeBuffer);
					fclose(fileR);
					
					//Format hardware response to get numerical values
					HwRes = responseBuffer[9] - '0';
					double hwTimeTaken = atof(hwTimeBuffer);
					
					printf("Full image sent\n");
					printf("SW result: %d; SW time taken: %f\n", SwRes, swTimeTaken);
					printf("HW result: %d; HW time taken: %f\n", HwRes, hwTimeTaken);
					printf("------------------------------------\n");	
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