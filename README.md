Clone the repository:  
git clone git@github.com:ramaty01/course-management-client.git  

Install npm package:  
npm install axios  
npm install react-router-dom  
npm install dotenv --save
npm install bootstrap
npm start  
  
This should be enough to run locally.  

You will probably have to replace  
REACT_APP_API_URL = 'https://course-management-olsc.onrender.com'  
in the .env 
REACT_APP_API_URL = 'http://localhost:5001'  
    
To publish:  
(DONT DO THIS UNLESS YOU ARE CERTAIN THE BUILD WONT FAIL SINCE THIS DEPLOYS THE APP)  
npm run build  
npm install gh-pages --save-dev  
npm run deploy  
  
