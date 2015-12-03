#Minion

Minion is a tiny MVC framework. It can be learned very fast and is good enough
for small to medium single-page applications.

It has some similarities with Angular:
- Controllers
- Components
- Routing (provided by Routie)
- Templating (provided by Mustache)

##Supported tags

###mn-view
Loads and renders referneced view. If a controller with the same id is
available, will bind the controller and invoke its optional lifecycle methods:

- **preRender**: Invoked before the view is rendered. Usually this is
	where the controller will retrieve some remote data to be displayed by
	the view. If a promise is returned, then the view will be rendered after
	the promise resolves, to make sure the data is available to the view. 

- **postRender**: Invoked after the view is rendered. Usually this is where
	the controller performs DOM manipulations with the rendered view or
	registers event listeners to some of the view elements. Notice that
	mn-on*event* is a simpler way of performing this, so this method should
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

###mn-onclick="*methodName*", mn-onsubmit="*methodName*"
Registers a listener so that *methodName* is invoked in the current controller
when the event takes place.

###mn-component="componentName"
Locates the component registered by *componentName* and invokes its *render* method.  

##ToDo:
### Development
- ESHint / TSLint
- Minification with proper source maps (webpack plugin is buggy)
- Set TypeScript compile target to ES6 and add Babel as a build step.
	- And maybe the Promise shim will no longer be required.

### Runtime
- Define controller interface (empty?)
- Refactor 'search' views & controller to flat search names
- Test refactor folders by functionality instead of component type 
- Show waiting animation & block current UI
- NLS/multilanguage

##Done:
- Infinitely nested subviews
- npm scripts with proper build / watch / serve
- Templating engine: Mustache
- Simple Web components
- Implement full set of CRUD operations for user table
- Improve controller lifecycle attached to view lifecycle
- Use hierarchical, controller-owned model, angular-style

