# ShutterSpotter

A location-based social app for photographers. Users can login, register, add and manage their own photographic points of interest, and add photos, descriptions, tags, etc. to each location.

Includes an MVC-based Node.js/[Hapi](https://hapi.dev/) web app styled using [Bulma](https://bulma.io/), as well as API endpoints, Swagger docs, cookie and JWT-based auth with scoped user access, and admin dashboard allowing for user CRUD, user scope modifications, and analytics.

This web app was created as part of an assignment for SETU's Computer Science HDip course. Two deployments of the app are available - [One](https://shutter-spotter-2.onrender.com/) using MongoDB on Cloud Atlas and Cloudinary for file storage, and [the other](https://shutter-spotter-firebase.onrender.com/) using Firestore and Firebase file storage.

## Getting Started
### Prerequisites
- [Node](https://nodejs.org/en/) (Version v18.14.0 used for dev/testing)

### Installing
To get a copy of the project running on your system, navigate to the project directory in a command prompt/shell and 
run the following to install all dependencies and compile Typescript.
```
npm install
tsc
```

After dependency installation and compilation has completed run
```
npm run dev
```
This will load the application and start a local server on port 3000.

## Author
- **Eoin Fennessy** - [GitHub](https://github.com/eoinfennessy)