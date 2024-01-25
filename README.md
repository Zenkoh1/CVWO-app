# CVWO Project!
Zen Koh
## Installation
## Step 1 - Dependencies

You will need:

* [Git](http://git-scm.com/downloads)
* [node](https://nodejs.org/)
* [Ruby](https://rubyinstaller.org/)
* [PostgreSQL](https://www.postgresql.org/download/)

## Step 2 - Clone the repository:

From the command line, clone the repository:

```sh
git clone https://github.com/Zenkoh1/CVWO-app.git
```

## Step 3 Setup Frontend
### Step 3.1 Change Directory and Install Dependencies

```sh
cd frontend
npm install
```

### Step 3.2 Set up environment variables

In `.env.development`, replace the url with the url of the rails API. It should be correct by default.

```sh
REACT_APP_API_ENDPOINT=http://localhost:3000
```

### Step 3.3 - Run the frontend

Start the React frontend with 

```sh
npm run devstart
```

## Step 4 Setup Backend
### Step 4.1 Change Directory and Install Dependencies

```sh
cd backend
bundle install
bundle update
```

### Step 4.2 Set up frontend url

In `config/environments/development.rb`, replace the url with the url of the frontend. It should be correct by default.

```sh
config.allowed_cors_origins = ["http://localhost:3001"]
```

### Step 4.3 Change credentials
Firstly, run `rails secret` to get the jwt_secret_key.

Then, run `EDITOR=code rails credentials:edit`, replacing `code` with a text editor of your choice (nano, vim etc.).

Finally, to the opened file `xxx-credentials.yml`, add the configurations below, inputting the appropriate information within the curly braces.

```sh
postgresql:
  username: {username}
  password: {password}
devise:
  jwt_secret_key: {jwt_secret_key}
```

### Step 4.4 Create and migrate the database

```sh
rails db:create
rails db:migrate
rails db:seed
```

### Step 4.5 - Run the backend

Start the Rails API backend with 

```sh
rails s
```