

a. You can start the server using the instructions below:
Before starting, ensure you have Node downloaded to your system.
Once you download and extract the zip, create a file named ".env" in the backend folder and copy and paste the following into it (without the quotations):
"
PORT=5000
MONGODB_URI=mongodb+srv://db_user:123abcD45678@gamereccluster.s1yn2hz.mongodb.net/game_recommender_db?appName=GameRecCluster
JWT_SECRET=gamerecsecretkey
"

Then, you will need to navigate to the project folder root in Command Prompt. The folder should be called CIS4004MernStack. The easiest way to do this is open the folder in the file explorer and copying the path.

Once you have the main folder open in command prompt, you will also need to install the dependencies.
Navigate to the backend folder of your local project via the command prompt, then enter this (not including the quotations):
"npm install express mongoose dotenv cors bcryptjs jsonwebtoken"

and then

"npm install --save-dev nodemon"

Then, navigate out of the backend folder and go to the frontend folder.

from the frontend folder type
"npm install"

then type
"npm install lucide-react"


Now, go back to the backend folder and type

"npm start"

The backend server should now be running. Leave this terminal open.

b. To start the frontend server, follow these instructions AFTER the ones listed above:

Open another command prompt terminal tab.
Navigate to the project folder as you did in the last step. Then navigate to the frontend folder.

From here, type "npm start"

Now the frontend server is running. Keep both this terminal and the last terminal open while you test.

c. How can the grader navigate to the application? I.e., what port and/or URI?
Once both a and b are complete, navigate to http://localhost:3000/

d. What Collections are needed in MongoDB?
You should not need to make any adjustments to MongoDB
