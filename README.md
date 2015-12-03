Minion
======

Minion is a tiny MVC framework. It can be learned very fast and is good enough
for small to medium single-page applications.

It has some similarities with Angular:
- Controllers
- Components
- Routing (provided by Routie)
- Templating (provided by Mustache)


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

