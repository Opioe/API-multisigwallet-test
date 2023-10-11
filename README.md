## How to run the project :


#### 1- Initiate node
```sh
npm init
```

#### 2- Install the dependencies

```sh
npm i --save-dev hardhat
npm i --save-dev @nomicfoundation/hardhat-toolbox
npm i fs
npm i express
npm i dotenv
```

#### 3- Global dependecies to run the API

```sh
npm i -g nodemon
```

#### 3- Initiate hardhat 

```sh
npx hardhat init
```

#### 4- Set up the .env 

- INFURA_API_KEY = "9a...51" 
- WALLET_PRIVATE_KEY = "f3...0p"

#### 5- Compile the contracts

```sh
npx hardhat compile
```

#### 6- Run the API script 

```sh
nodemon server.js
```

#### 7- Call the api

```sh
localhost:3000/deploy
```
