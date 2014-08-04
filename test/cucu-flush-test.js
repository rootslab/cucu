#!/usr/bin/env node

var log = console.log
    , assert = require( 'assert' )
    , util = require( 'util' )
    , Cucu = require( '../' )
    , slice =  Array.prototype.slice
    , iopt = {
        showHidden : false
        , depth : 3
        , colors : true
        , customInspect : true 
    }
    , inspect = function ( arg, opt ) {
        return util.inspect( arg, iopt );
    }
    , qq = Cucu()
    , id0 = 'task0'
    , id1 = 'task1'
    , fn0 = function () {
        log( '> scheduled task %s.', inspect( id0 ) );
    }
    , fn1 = function () {
        log( '> scheduled task %s.', inspect( id1 ) );
    }
    , args = [ 0, 1, 2, 3 ]
    , scope = { a : 1 }
    , interval = 1000
    , op = null
    ;

log( '- #add a task with id: %s.', inspect( id0 ) );
op = qq.add( id0, fn0, args, scope, interval );

log( '- #add a task with id: %s.', inspect( id1 ) );
op = qq.add( id1, fn1, args, scope, interval );

log( '- now run task id: %s.', inspect( id0 ) );
op = qq.run( id0 );

log( '- now run task id: %s.', inspect( id1 ) );
op = qq.run( id1 );

log( '- try #flush operation with running tasks, it should succeed and returns: %s.', inspect( [ id0, id1 ] ) );
op = qq.flush();
assert.deepEqual( op, [ id0, id1 ], 'got: ' + inspect( op ) );

log( '- now no task should be present: %s.', inspect( Object.keys( qq.ttable ) ) );
assert.ok ( Object.keys( qq.ttable ).length === 0 );

log( '- check Cucu.running property, should be: %s.', inspect( 0 ) );
assert.ok( qq.running === 0, 'got: ' + inspect( qq.running ) );