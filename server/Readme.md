🔧 Backend Setup (Information Format)
1. Create the Backend Folder
Create a folder named backend in your project root. This will store all your backend code including API, logic, and database connections.

2. Initialize the Project
Navigate into the backend folder using your terminal and run the command to initialize a new Node.js project. This will generate a package.json file.

3. Install Required NPM Packages
Here’s the list of essential packages you need to install:

Core Backend

express – for building APIs

mongoose – for MongoDB database integration

dotenv – for loading environment variables

cors – to allow requests from frontend

nodemon – for auto-reloading during development

Authentication

jsonwebtoken – for creating and verifying JWT tokens

bcryptjs – for hashing passwords

Blockchain Integration

ethers – for interacting with smart contracts on Ethereum/Polygon

(Optional) web3 – alternative to ethers, if preferred

File Uploads & Storage

multer – for handling file uploads (e.g. certificates)

aws-sdk – if storing files in AWS S3

axios – for calling IPFS or external APIs

Other Utilities

morgan – for logging requests (optional for dev)

express-validator – for request validation (optional)

You can install them with npm install command one by one or all at once.

4. Folder Structure
Once dependencies are installed, set up folders like:

controllers – for route logic

models – for MongoDB schemas

routes – for API endpoints

services – for blockchain logic and certificate generation

middlewares – for auth, error handling, etc.

config – for MongoDB connection

Create an index.js or server.js file at the root of the backend folder to start your Express app.

5. Setup .env File
Create a .env file to store secrets and environment variables like:

MongoDB URI

JWT secret

Blockchain contract address

Private key

Infura or RPC URL

This ensures you don’t hardcode any secrets in your codebase.

6. Running the Backend
For development, run the backend using:

npm run dev if you're using nodemon (add a script in package.json)

node server.js for production


project-name@1.0.0 /your/project/path
├── express@4.18.2
├── mongoose@7.2.2
├── cors@2.8.5
├── dotenv@16.3.1
├── bcryptjs@2.4.3
├── jsonwebtoken@9.0.0

npm install multer
npm install nodemailer
npm i axios


npm init -y

to Run :-  npm run start // start because i the hardik make write in package.json start: "nodemon server.js"  ok



## Marketplace demo data

The Marketplace reads active carbon-credit projects from MongoDB through the Express API. To populate development data:

```bash
npm run seed:carbon
```

This creates or updates 10 realistic AerthX demo projects. To remove only the demo records and recreate them:

```bash
npm run seed:carbon:reset
```

The seed script requires `MONGO_URI` in `server/.env`. Demo records are marked with a `seedKey` beginning with `demo-` so they can be safely updated or removed without touching normal project records.
