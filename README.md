# `react-scores` project

This project contains a simple example of a react application for recording the scored you got with your exams.

It will be developed in phases, in several weeks, to illustrate the different features of the framework.

* Phase 1: just static component rendering, and props-propagation. Uses 'fake' data and does not allow any user interaction.

* Phase 2: add interactivity: define state inside components, pass down 'function' props to update the state. Branch: [with_state](https://github.com/polito-WA1-2020/react-scores/tree/with_state)

* Phase 3: add interaction with server: use REST API. Branch: [with_fetch](https://github.com/polito-WA1-2020/react-scores/tree/with_fetch), server project: [react-scores-server](https://github.com/polito-WA1-2020/react-scores-server)

* Phase 4: add authorization with JWT on REST API + an example of CSRF protection. Branch: [with_auth](https://github.com/polito-WA1-2020/react-scores/tree/with_auth), corresponding server project: [Branch with_auth in react-scores-server](https://github.com/polito-WA1-2020/react-scores-server/tree/with_auth). Check the server project to know the password of the users.

* Phase 5: add router. Three pages: /, /login, /update. Automatic redirect is implemented from / to /login if user is not logged in, and from /login to / if it is logged in. If the authorization cookie is still valid, upon reload no new login is required. Branch: [with_router](https://github.com/polito-WA1-2020/react-scores/tree/with_router), corresponding server project: [Branch with_router in react-scores-server](https://github.com/polito-WA1-2020/react-scores-server/tree/with_router). A different branch is needed because a new REST API call has been added, to retrieve the name of the user when the authorization token is still valid.
