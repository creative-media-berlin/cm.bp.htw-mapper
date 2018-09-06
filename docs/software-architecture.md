# System description

## Folder structure

We scaffolded our app with the react-native CLI using the command `react-native init`. This generated different folders and files which put the app together.

In the top-level directory, you can find the entry file **index.js** to our app. Here we set up Redux, our state management of choice, and return a React component that gets rendered when running the app. The other files next to it are mostly config files, for example **package.json** specifies our dependencies and **.babelrc** has the JS transpiling options.

The app folder contains our React app with all the business logic and UI components.

The two folders **android** and **ios** contain the necessary files for an app of the respective platform. So in our case, we only changed the **android** folder. If we wanted to use packages which go beyond just using JavaScript, we had to register them in the gradle config files there. It was also the right place to specify the permissions we need and features we want to use (i.e. the compass). In order to integrate [IndoorAtlas](https://www.indooratlas.com/), we needed to touch the Java code inside this folder as well, which leads us to one of the main components putting our app together: IndoorAtlas.

## IndoorAtlas

In order to get the necessary data about the current device position, we had to use the Android SDK, as there is no implementation for React Native (currently). So we had to import the IndoorAtlas package in our main activity and set up all the necessary listeners in a different module. Next step was to pass this data over to the React Native part of the app living inside the app folder. Therefore, we used the event emitter/listener pattern imported from the React bridge, exactly designed for this kind of communication. So now the Android SDK is listening for position and status updates and passes these on to our app immediately.

## Mapbox

Mapbox allows us to create maps with custom graphics, colors and labels for the HTW campus. We needed more than one to represent the different floor levels and decided to just load a different map based on the current floor level. These maps can not only have custom styles, but also contain data. In our app, this was extremely useful, because we could store information about each room (number, type, ...) which are then available to use inside the app. This data thus is essentially mapped to polygons with real-world coordinates.

Fortunately, there also is a React Native package which made displaying the correct map and getting all the necessary data very easy. The Mapbox component renders the respective map to the screen and does already provide the basic functionality you would expect from a map. To render the correct map though, we had to specify our token and provide the correct style ID based on the floor level in order to fetch the correct one. We could also position custom graphics on the map to show the current position, the rendered path and a room selection overlay. The code for this can be found at **app/components/Map**.

To calculate paths to rooms or points of interest, we also needed use the data outside the Map component, so we put the IDs for the respective datasets in a config file which can found at **app/components/const/floors.js**. 

## State management

At some point, it was necessary to have a global data store, so that each component can get the data it needs. For that, we used [Redux](https://redux.js.org/) which works very well together with React. We dispatch **actions** to request a change to the global state and use **reducers** to make the actual changes. Having a global state was extremely useful for different use cases: save the calculated graph of nodes (the calculation takes some time), make UI state accessible to different parts of the app (menu open? room selected? wifi is on?) and keep information like the current position in one place again accessible to every component. To keep the current position as an example here, the compass and map components both need this data.

## Components

The components inside **app/components** construct the app in a HTML-like tree and can be re-used across multiple places. Some components have their own state to keep track of, for example whether or not a switch is toggled, and others are basically "dumb" and can only be configured by passing data or functions down to them (a button or popup). In fact, the only way of communication between components is the parent passing so called *props* down to the child.

There are also renderless components which only listen to changes and dispatch actions as a result. In our app, one handles the position updates from IndoorAtlas and keeps track of the current building. Another one handles the navigation and listens for changes there.
