###Cucu

[![NPM VERSION](http://img.shields.io/npm/v/cucu.svg?style=flat)](https://www.npmjs.org/package/cucu)
[![CODACY BADGE](https://img.shields.io/codacy/b18ed7d95b0a4707a0ff7b88b30d3def.svg?style=flat)](https://www.codacy.com/public/44gatti/cucu)
[![CODECLIMATE](http://img.shields.io/codeclimate/github/rootslab/cucu.svg?style=flat)](https://codeclimate.com/github/rootslab/cucu)
[![CODECLIMATE-TEST-COVERAGE](https://img.shields.io/codeclimate/coverage/github/rootslab/cucu.svg?style=flat)](https://codeclimate.com/github/rootslab/cucu)
[![LICENSE](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/rootslab/cucu#mit-license)

[![TRAVIS CI BUILD](http://img.shields.io/travis/rootslab/cucu.svg?style=flat)](http://travis-ci.org/rootslab/cucu)
[![BUILD STATUS](http://img.shields.io/david/rootslab/cucu.svg?style=flat)](https://david-dm.org/rootslab/cucu)
[![DEVDEPENDENCY STATUS](http://img.shields.io/david/dev/rootslab/cucu.svg?style=flat)](https://david-dm.org/rootslab/cucu#info=devDependencies)
[![NPM DOWNLOADS](http://img.shields.io/npm/dm/cucu.svg?style=flat)](http://npm-stat.com/charts.html?package=cucu)

[![NPM GRAPH1](https://nodei.co/npm-dl/cucu.png)](https://nodei.co/npm/cucu/)

[![NPM GRAPH2](https://nodei.co/npm/cucu.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cucu/)

[![status](https://sourcegraph.com/api/repos/github.com/rootslab/cucu/.badges/status.png)](https://sourcegraph.com/github.com/rootslab/cucu)
[![views](https://sourcegraph.com/api/repos/github.com/rootslab/cucu/.counters/views.png)](https://sourcegraph.com/github.com/rootslab/cucu)
[![views 24h](https://sourcegraph.com/api/repos/github.com/rootslab/cucu/.counters/views-24h.png)](https://sourcegraph.com/github.com/rootslab/cucu)

> **_Cucu_**, a tiny module to schedule repeated execution of ( single process ) methods/tasks.

###Install

```bash
$ npm install cucu [-g]
```

> __require__:

```javascript
var Cucu  = require( 'cucu' );
```

###Run Tests

```bash
$ cd cucu/
$ npm test
```

###Constructor

```javascript
Cucu()
// or
new Cucu()
```

###Properties

```javascript
/*
 * The current number of running tasks.
 */
Cucu.running : Number

/*
 * Task table, an obj/hash containing tasks by id/key/name.
 *
 * A table entry for a task named 'id' is an obj/hash like:
 *
 *  ttable[ 'id' ] = {
 *      id : 'id'
 *      , fn : fn
 *      , interval : Number
 *      , args : Array
 *      , scope : Object
 *      , status : Number | Object
 *      , repeat : Number
 *      // timestamps for task start, current iteration and task stop/halt/end.
 *      , stime : Number
 *      , itime : Number
 *      , etime : Number
 *      // get task time infos
 *      , timetable : Function
 *      // Cucu method shortcuts
 *      , run : Function
 *      , stop : Function
 *      , del : Function
 *  };
 *
 * NOTE: Every entry contains shortcuts to Cucu#run, #stop and #del methods, already
 * curried with their own ids. For example, if exists a task named 'dumb' in the task
 * table, you could also use the methods below, for running, stopping or deleting an
 * existing task:
 * 
 * Cucu.ttable.dumb.run( [ Number interval [, Array args [, Number times ] ] ] ) : Number
 *
 * Cucu.ttable.dumb.stop() : Array
 *
 * Cucu.ttable.dumb.del() : Array
 *
 *
 */
Cucu.ttable : Object
```

###Methods

> Arguments within [ ] are optional.

```javascript
/*
 * Add a task; a task will be added only if there is no other task already running
 * with this name/id.
 * It returns 1 if task is added, 0 if the same task id is already running, -1 if
 * an error occurs.
 */
Cucu#add( String id, Function fn [, Array args [, Object scope [, Number interval ] ] ] ) : Number

/*
 * Run a task by name/id. Optionally you can specify interval, function arguments and 
 * the max number executions for a task.
 * It returns 1 if task is started, 0 if the task is already running, -1 if no task
 * exists.
 *
 * NOTE: if 'times' option is specified, the scheduled function 'fn' will get, as the
 * first argument, a function to execute when task will be done.
 */
Cucu#run( String id [, Number interval [, Array args [, Number times ] ] ] ) : Number

/*
 * Remove tasks by id/name; a task will be removed only if it is not currently running.
 * It returns a list of ids/names for all the removed tasks.
 */
Cucu#del( String id | Array ids ) : Array

/*
 * Stop a running method/task by name/id.
 * It returns a list of ids/names for all the stopped tasks.
 */
Cucu#stop( String id | Array ids ) : Number

/*
 * Start all non-running tasks.
 * It returns the total number of non-running tasks started.
 */
Cucu#awake() : Number

/*
 * Halt all running tasks.
 * It returns a list of ids/names for all the stopped tasks.
 */
Cucu#halt() : Array

/*
 * Stop and delete all tasks.
 * It returns the list of ids/names for all the removed tasks.
 */
Cucu#flush() : Array

/*
 * Get a list of names/ids for all the currently active/running tasks.
 */
Cucu#active() : Array

/*
 * It returns the total number of tasks.
 */
Cucu#size() : Number

```

### MIT License

> Copyright (c) 2015 &lt; Guglielmo Ferri : 44gatti@gmail.com &gt;

> Permission is hereby granted, free of charge, to any person obtaining
> a copy of this software and associated documentation files (the
> 'Software'), to deal in the Software without restriction, including
> without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to
> permit persons to whom the Software is furnished to do so, subject to
> the following conditions:

> __The above copyright notice and this permission notice shall be
> included in all copies or substantial portions of the Software.__

> THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
> IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
> CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
> TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
> SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[![GA](https://ga-beacon.appspot.com/UA-53998692-1/cucu/Readme?pixel)](https://github.com/igrigorik/ga-beacon)