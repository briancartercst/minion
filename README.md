#Minion

<img src="img/minion.jpg"
	style="width: 50%; max-width:100%; margin-left: auto; margin-right: auto; display: block">

Minion is a tiny MVC framework. It can be learned very fast and is good enough
for small to medium single-page applications.

It has some similarities with Angular:
- Controllers
- Components
- Routing (provided by Routie)
- Templating (provided by Mustache)

##Supported tag attributes

###mn-view="*viewName*"
Loads and renders a html file as a child of the tag containing this attribute.
If a controller with the same id is available, will bind the controller and
invoke its optional lifecycle methods:

- **preRender**: Invoked before the view is rendered. Usually this is
	where the controller will retrieve some remote data to be displayed by
	the view. If a promise is returned, then the view will be rendered after
	the promise resolves, to make sure the data is available to the view. 

- **postRender**: Invoked after the view is rendered. Usually this is where
	the controller performs DOM manipulations with the rendered view or
	registers event listeners to some of the view elements. Notice that
	mn-*event* is a simpler way of performing this, so this method should
	be used only for more complex requirements.

- **done**: Invoked when the view is removed from the DOM. This is where
	the controller can perform any teardown if required. Notice that event
	listeners bound to elements of the view will be auomatically removed
	by jQuery. 

####Example:
```HTML
	<div mn-view="users"></div>
```
Will load, cache and render users.html. If a controller has been registered
with the name "users", then it will invoke its lifecycle methods and will
bind it to the Mustache template context.

###mn-click="*methodName*", mn-submit="*methodName*"
Registers a listener so that *methodName* is invoked in the current controller
when the event takes place.

####Examples:
```HTML
	<form mn-submit="save">
```
Will call the *save* method of the current controller when the form is submitted.
Notice that the method should return false to avoid the browser from posting the
form to the server.

```HTML
	<button mn-click="cancel">
```
Will call the *cancel* method of the current controller when the button is clicked. 

###mn-component="componentName"
Locates the component registered by *componentName* and invokes its *render* method.
  
####Example:
```HTML
	<div mn-component="my-input" name="email" label="Your e-mail"></div>
```
Locates the component registered as *my-input* and invokes its *render* method. The
component has access to the *name* and *label* attributes, so it can expand the div
into a full label / input tag pair. 

##ToDo:
### Development
- ESHint / TSLint
- Minification with proper source maps (webpack plugin is buggy)
- Set TypeScript compile target to ES6 and add Babel as a build step.
	- And maybe the Promise shim will no longer be required.

### Runtime
- Deal with XSS attacks providing input values such as: **"&gt;&lt;script&gt;alert("haha!")&lt;/script&gt;**
- Define controller interface (empty?)
- Refactor 'search' views & controller to flat search names
- Test refactor folders by functionality instead of component type 
- NLS/multilanguage

##Done:
- Infinitely nested subviews
- npm scripts with proper build / watch / serve
- Templating engine: Mustache
- Simple Web components
- Implement full set of CRUD operations for user table
- Improve controller lifecycle attached to view lifecycle
- Use hierarchical, controller-owned model, angular-style
- Config object to specify parameters such as:
	- Base path for loading templates
	- showLoading / hideLoading functions
- Show waiting popup & block current UI
