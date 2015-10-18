Testing a simple SPA, using:
- Babel for transpiling ES6 to JS
- Routie for simple navigation routing
- jQuery
- Bootstrap
- initializr to get a clean boilerplate

ToDo:
- Browserify
- ESHint
- JS minifier
- Grunt/gulp/make with proper build / watch / serve


Functionality
-------------
- Mobile First

Views:
- Landing - show menu with:
	- Login => show login form
	- Search => show search form
	- Share => show search form
	- About => show static about page
- Login form:
	- Request userid/pw
	- Provide login button for existing users
	- Provide sign in button for new users => show new user form
- Logged In - show menu with:
	- Log Out => go back to landing
	- Search
	- Edit profile => show profile
	- Favorites
- Search
	- Show search form
	- When submit, show results page
- Results
	- Show list of flats, lazy load
	- When flat is selected, show details
- Details
	- Pictures - support zooming
	- Add to favorites
	- Chat
- Chat
	- Show chat for specific flat
- Favorites
	- Show results page with list of favorited flats