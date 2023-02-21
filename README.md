## Laundryfy server app

[![CircleCI](https://img.shields.io/circleci/project/github/contentful/the-example-app.nodejs.svg)](https://circleci.com/gh/contentful/the-example-app.nodejs)

Through installing Laundryfy server app you'll be able to:

- consume endpoints from REST APIs service
- create and maintain MongDB database
- use auth by common credentials and Google Auth

The app provides great flexibility and facilities for being consumed from any HTTP Client.

You can see a hosted version of `Laundryfy server app` on <a href="https://launfryfy-server.onrender.com/" target="_blank">Render</a>.

## What is Laundryfy Server App?

Laundryfy server app is a the back-end side of Laundryfy. Laundryfy is a web app for managing your laundry's resources in a very efficient way.

You can check for docs <a href="https://documenter.getpostman.com/view/13880545/2s93CHtuM4/" target="_blank">here</a>.

Also, we provide a basic UML Class model for a better understanding of the business workflow:
![imagen](https://user-images.githubusercontent.com/47878970/219884880-5840515f-b4e2-4cbe-82b7-df29f81de2b4.png)

## Requirements

* Node
* Git

## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/jcruzolivera/laundryfy-server.git
cd laundryfy-server
```

```bash
npm install
```

## Steps for developing

To start coding into the express server, run the following

Create a new local git branch called dev. When you will be about to commit, execute git checkout -d <version-update> and make a pull request


## Use Docker
You can also run this app as a Docker container:

Step 1: Clone the repo

Step 2: Build the Docker image

```bash
docker build -t laundryfy-server .
```

Step 3: Run the Docker container locally:

```bash
docker run -p 3000:3000 -d laundryfy-server
```
-----------------------
## Next version updates:
- Design and implement a better way for modeling payments
- Migrate users authentication to FusionAuth
