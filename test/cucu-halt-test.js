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
    , noid = 'noid'
    , fn0 = function () {
        log( '> scheduled task %s.', inspect( id0 ) );
        log( '> check fn scope, should be: %s.', inspect( scope ) );
        assert.deepEqual( this, scope,  'got: ' + inspect( this ) );
    }
    , fn1 = function () {
        log( '> scheduled task %s.', inspect( id1 ) );
        log( '> check fn scope, should be: %s.', inspect( scope ) );
        assert.deepEqual( this, scope,  'got: ' + inspect( this ) );
    }
    , args = [ 0, 1, 2, 3 ]
    , scope = { a : 1 }
    , interval = 1000
    , interval0 = 700
    , interval1 = 1300
    , op = null
    ;

log( '- #add 2 tasks with id: %s.', inspect( [ id0, id1 ] ) );
op = qq.add( id0, fn0, args, scope, interval );
op = qq.add( id1, fn1, args, scope, interval );

log( '- now run task id: %s, with interval: %s.', inspect( id0 ), inspect( interval0 ) );
op = qq.run( id0, interval0 );
log( '- now run task id: %s, with interval: %s.', inspect( id1 ), inspect( interval1 ) );
op = qq.run( id1, interval1 );

log( '- check Cucu.running property, should be: %s.', inspect( 2 ) );
assert.ok( qq.running === 2, 'got: ' + inspect( qq.running ) );

log( '- #halt all tasks' );
op = qq.halt();

log( '- check #halt operation result, should be: %s.', inspect( [ id0, id1 ] ) );
assert.deepEqual( op, [ id0, id1 ], 'got: ' + inspect( op ) );

log( '- check interval for task id: %s, should be: %s.', inspect( id0 ), inspect( null ) );
assert.equal( qq.ttable[ id0 ].status._idleTimeout, null, 'got: ' + inspect( qq.ttable[ id1 ].status._idleTimeout ) );

log( '- check interval for task id: %s, should be: %s.', inspect( id1 ), inspect( null ) );
assert.equal( qq.ttable[ id1 ].status._idleTimeout, null, 'got: ' + inspect( qq.ttable[ id1 ].status._idleTimeout ) );

log( '- check Cucu.running property, should be: %s.', inspect( 0 ) );
assert.ok( qq.running === 0, 'got: ' + inspect( qq.running ) );

log( '- #halt all tasks.' );
op = qq.halt( null );

log( '- check #halt operation result, should be: %s.', inspect( [] ) );
assert.deepEqual( op, [], 'got: ' + inspect( op ) );