# OOjs Release History

## v1.1.10 / 2015-11-11
* EventEmitter: Allow disconnecting event handlers given by array (Moriel Schottlender)
* Add EmitterList class (Moriel Schottlender)
* Add SortedEmitterList class (Moriel Schottlender)
* core: Add binarySearch() utility from VisualEditor (Ed Sanders)
* build: Bump various devDependencies to latest (James D. Forrester)
* tests: Add QUnit web interface (Moriel Schottlender)
* AUTHORS: Update for the past few months (James D. Forrester)

## v1.1.9 / 2015-08-25
* build: Fix the build by downgrading Karma and removing testing of Safari 5 (Timo Tijhof)
* core: Remove dependency on Object.create (Bartosz Dziewoński)
* test: Don't use QUnit.supportsES5 (Bartosz Dziewoński)

## v1.1.8 / 2015-07-23
* EventEmitter: Remove TODO about return value of #emit and tweak tests (Bartosz Dziewoński)
* build: Add explicit dependency upon grunt-cli (Kunal Mehta)
* build: Various fixes for cdnjs support (James D. Forrester)

## v1.1.7 / 2015-04-28
* Factory: Remove unused, undocumented 'entries' property (Ed Sanders)
* Registry: Provide an unregister method (Ed Sanders)

## v1.1.6 / 2015-03-18
* core: Improve class related unit tests (Timo Tijhof)
* jsduck: Set --processes=0 to fix warnings-exit-nonzero (Timo Tijhof)
* core: Provide OO.unique for removing duplicates from arrays (Ed Sanders)

## v1.1.5 / 2015-02-25
* EventEmitter: Remove unneeded Array.prototype.slice call (Timo Tijhof)
* build: Bump various devDependencies (James D. Forrester)
* build: Remove unused generateDocs.sh script (Timo Tijhof)
* Build: Use jquery from npm instead of embedded in the repo (Timo Tijhof)
* Use Node#isEqualNode to compare node objects (Ori Livneh)
* Recurse more frugally in oo.compare (David Chan)

## v1.1.4 / 2015-01-23
* build: Update devDependencies (James D. Forrester)
* Consistently use @return annotation (Bartosz Dziewoński)
* util: Fix typo "siuch" in comment (Timo Tijhof)
* readme: Update badges (Timo Tijhof)
* build: Bump copyright notice to 2015 (James D. Forrester)
* Factory: Enable v8 optimisation for #create (Ori Livneh)
* EventEmitter: Enable v8 optimisation for #emit (Ori Livneh)

## v1.1.3 / 2014-11-17
* core: Explicitly bypass undefined values in oo.compare() (Roan Kattouw)
* core: Add getProp() and setProp() methods (Roan Kattouw)

## v1.1.2 / 2014-11-05
* build: Bump miscellaneous devDependencies to latest (James D. Forrester)
* build: Use local Chrome and Firefox in ci task (Timo Tijhof)
* EventEmitter: Use hasOwn check in #emit (Ed Sanders)
* EventEmitter: Use hasOwn check in #off (Timo Tijhof)

## v1.1.1 / 2014-09-10
* core: Make oo.compare cover boolean as well as number and string primitives (James D. Forrester)

## v1.1.0 / 2014-08-31
* EventEmitter: Make #validateMethod private (Roan Kattouw)

## v1.0.12 / 2014-08-20

* build: Tell people which version they're using (James D. Forrester)
* build: Update devDependencies (Timo Tijhof)
* Registry: Guard against Object prototype keys in lookup() (Ed Sanders)
* core: Add new oo.copy callback for all nodes, not just leaves (C. Scott Ananian)
* EventEmitter: Look up callbacks by name at call time (divec)
* core: Use empty object as fallback when comparing to null/undefined (Ed Sanders)

## v1.0.11 / 2014-07-23

* EventEmitter: Remove dead code that claims to prevent double bindings (Timo Tijhof)
* EventEmitter: Fix bug in disconnect loop for double un-bindings (Ed Sanders)
* EventEmitter: Support events named "hasOwnProperty" (Timo Tijhof)
* test: Added tests for a variety of previously-untested areas (Timo Tijhof)
* build: Update jscs, now using new "wikimedia" preset (Timo Tijhof)
* build: Use Istanbul for code coverage (Timo Tijhof)
* build: Implement Karma module for cross-browser unit testing (Timo Tijhof)
* readme: Cleanup and compatibility with the gitblit markdown parser (Timo Tijhof)

## v1.0.10 / 2014-06-19

* test: Update qunitjs to v1.14.0 (Timo Tijhof)
* build: Use .txt extension for intro.js and outro.js (Timo Tijhof)
* package.json: Update devDependencies (update jshint and jscs config) (Timo Tijhof)
* build: Add dot files to grunt watch (Ed Sanders)
* build: Implement build target optimised for jQuery (Timo Tijhof)
* test: Upgrade jQuery to v1.11.1 (paladox)
* core: Use bracket notation for 'super' for ES3 compatibility (James D. Forrester)
* test: Fix broken getHash test for iframe Object (Timo Tijhof)
* core: Implement support for ES3 browsers (Timo Tijhof)

## v1.0.9 / 2014-04-01
* core: Add initClass method for initializing static in base classes (Ed Sanders)
* package.json: Bump jscs to 0.4.1 (James D. Forrester)
* readme: Use HiDPI version of npm badge (Timo Tijhof)
* EventEmitter: Improve test coverage for disconnect() (Timo Tijhof)

## v1.0.8 / 2014-03-11
* Factory: Use Class.super instead of hard coding parent class (Timo Tijhof)
* Registry: Remove redundant type validation logic in #register (Timo Tijhof)
* core: Use Class.super instead of this.constructor.super (Timo Tijhof)
* doc: Improve overall documentation and fix minor issues (Timo Tijhof)
* core: Add a 'super' property to inheriting classes (Timo Tijhof)
* build: Implement generateDocs.sh script (Timo Tijhof)
* package.json: Update devDependencies (Timo Tijhof)

## v1.0.7 / 2014-01-21
* Update dist build header and license file for 2014 (James D. Forrester)
* build: Set up node-jscs, pass it, and configure in Grunt (Timo Tijhof)
* package.json: Set npm dependencies at fixed versions (Timo Tijhof)

## v1.0.6 / 2013-12-10
* Change display name from OOJS to OOjs (Timo Tijhof)
* Add qunitjs lib to repo (Timo Tijhof)
* Update references from GitHub to Wikimedia (Timo Tijhof)
* Add .gitreview (Roan Kattouw)

## v1.0.5 / 2013-10-23

* core: Add simpleArrayUnion, simpleArrayIntersection and simpleArrayDifference (Timo Tijhof)
* build: Consistenetly use oojs as filename instead of oo (Timo Tijhof)
* core: Remove unused code for tracking mixins (Timo Tijhof)

## v1.0.4 / 2013-10-10

* core: Add getHash to core (Trevor Parscal)

## v1.0.3 / 2013-10-10

* core: Add oo.Registry and oo.Factory (Trevor Parscal)
* EventEmitter: Re-use #off in #connect and add context argument to #off (Trevor Parscal)
* readme: Add npm install and npm test to release process (Timo Tijhof)

## v1.0.2 / 2013-07-25

* core: Optimise oo.compare when a and b are equal by reference (Timo Tijhof)
* test: Fix false positive in nodejs EventEmitter test (Timo Tijhof)
* core: Make "constructor" non-enumerable in oo.inheritClass (Timo Tijhof)

## v1.0.1 / 2013-06-06

* license: Refer to OOJS Team and other contributors (Timo Tijhof)
* test: Fix oo.EventEmitter context test failure on nodejs (Timo Tijhof)

## v1.0.0 / 2013-06-06

* core: Don't copy non-plain objects in oo.copy (Timo Tijhof)
* core: Implement oo.isPlainObject (Timo Tijhof)
* core: Optimise reference to hasOwnProperty (Timo Tijhof)
* readme: Document release process (Timo Tijhof)
* core: Apply asymmetrical recursively in oo.compare (Timo Tijhof)
* test: Add tests for oo.compare (Timo Tijhof)
* core: Rename oo.compareObjects to oo.compare (Timo Tijhof)
* core: Remove obsolete oo.createObject (Timo Tijhof)
* docs: Add categories and include builtin classes (Timo Tijhof)

## v0.1.0 / 2013-06-05

* test: Add tests for oo.EventEmitter (Timo Tijhof)
* build: Optimise watch configuration (Timo Tijhof)
* build: Upgrade to grunt-contrib-jshint 0.5 and jshint 2 (Timo Tijhof)
* build: Add support for JSDuck (Timo Tijhof)
* core: Remove Object.create polyfill (Timo Tijhof)
* build: Make grunt use .jshintrc (Timo Tijhof)
* travis: Install grunt-cli before install instead of between install and test (Timo Tijhof)
* build: Implement build process to fix breakage in nodejs (Timo Tijhof)
* test: Minimise output from node-qunit (Timo Tijhof)
* build: Add grunt watch (Timo Tijhof)
* Initial import of utility functions and EventEmitter class (Trevor Parscal)
