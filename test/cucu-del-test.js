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
        log( '> now, stop scheduled task %s.', inspect( id0 ) );
        qq.stop( id0 );
        log( '- try #del operation with task, should return: %s.', inspect( [ id0 ] ) );
        op = qq.del( id0 );
        assert.deepEqual( op, [ id0 ], 'got: ' + inspect( op ) );
    }
    , fn1 = function () {
        log( '> now, stop scheduled task %s.', inspect( id1 ) );
        qq.stop( id1 );
        log( '- try #del operation with task, should return: %s.', inspect( [ id1 ] ) );
        op = qq.del( id1 );
        assert.deepEqual( op, [ id1 ], 'got: ' + inspect( op ) );
    }
    , args = [ 0, 1, 2, 3 ]
    , scope = { a : 1 }
    , interval = 1000
    , op = null
    ;

log( '- #del an empty list should return an empty array: %s.', inspect( [] ) );
op = qq.del( [] );
assert.deepEqual( op, [] );
log( '- #del without args should return an empty array: %s.', inspect( [] ) );
op = qq.del();
assert.deepEqual( op, [] );

log( '- #add a task with id: %s.', inspect( id0 ) );
op = qq.add( id0, fn0, args, scope, interval );

log( '- #add a task with id: %s.', inspect( id1 ) );
op = qq.add( id1, fn1, args, scope, interval );

log( '- now run task id: %s.', inspect( id0 ) );
op = qq.run( id0 );

log( '- now run task id: %s.', inspect( id1 ) );
op = qq.run( id1 );

log( '- try #del operation with running tasks %s %s, should fail with: %s.', inspect( id0 ), inspect( id1 ), inspect( -1 ) );
op = qq.del( id0 );
assert.deepEqual( op, [], 'got: ' + inspect( op ) );
op = qq.del( id1 );
assert.deepEqual( op, [], 'got: ' + inspect( op ) );

setTimeout( function () {
    log( '- now no task should be present.' );
    assert.ok ( Object.keys( qq.ttable ).length === 0 );
}, 2000 );