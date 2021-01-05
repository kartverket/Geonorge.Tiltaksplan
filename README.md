# Geonorge.Tiltaksplan

## Installation

### Install dependecies
In the project directory run:
```sh
yarn
```

### Add configuration file
1. Add a new file with the name `config.local.json` in the `src/config/` directory.
2. Copy content from `src/config/config.json` into your new file
3. Replace hostname `"redirect_uri"` and `"post_logout_redirect_uri"` with https://localhost:44357


## Run in development mode
Uses configurations from `src/config/config.local.json`

In the project directory run:
```sh
yarn start
```

Runs the app in the development mode.<br>
Open [https://localhost:44357](https://localhost:44357) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Build for production
Uses configurations from `src/config/config.json`

In the project directory run:
```sh
yarn build
```

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!
