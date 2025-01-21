Clone the repository:  
git clone git@github.com:ramaty01/course-management-client.git  

Install npm package:  
npm install axios  
npm install react-router-dom  
npm start  
  
This should be enough to run locally.  
You will probably have to replace  
API_URL = 'https://course-management-olsc.onrender.com'  
in all three pages with  
API_URL = 'http://localhost:5001'  
    
To publish:  
npm run build  
npm install gh-pages --save-dev  
npm run deploy  
