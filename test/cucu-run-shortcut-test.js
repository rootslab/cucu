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
        log( '> check fn scope, should be: %s.', inspect( scope ) );
        assert.deepEqual( this, scope,  'got: ' + inspect( this ) );
        log( '> scheduled task args: %s.', inspect( slice.call( arguments ) ) );
        assert.deepEqual( slice.call( arguments ). args0 );
    }
    , fn1 = function () {
        log( '> scheduled task %s.', inspect( id1 ) );
        log( '> check fn scope, should be: %s.', inspect( scope ) );
        assert.deepEqual( this, scope,  'got: ' + inspect( this ) );
        log( '> scheduled task args: %s.', inspect( slice.call( arguments ) ) );
        assert.deepEqual( slice.call( arguments ). args1 );
    }
    , args0 = [ 0, 1, 2, 3 ]
    , args1 = [ 4, 5, 6, 7, 8, 9, 10 ]
    , scope = { a : 1 }
    , interval = 1000
    , interval0 = 700
    , interval1 = 1300
    , op = null
    ;

log( '- #add 2 tasks with id:', inspect( [ id0, id1 ] ) );
op = qq.add( id0, fn0, args0, scope, interval );
op = qq.add( id1, fn1, args1, scope, interval );

log( '- now run task id: %s, with interval: %s.', inspect( id0 ), inspect( interval0 ) );
op = qq.ttable[ id0 ].run( interval0 );

log( '- check #run operation result, should be: %s.', inspect( 1 ) );
assert.ok( op === 1, 'got: ' + inspect( op ) );

log( '- check interval for task id: %s, should be: %s.', inspect( id0 ), inspect( interval0 ) );
assert.equal( qq.ttable[ id0 ].status._idleTimeout, interval0, 'got: ' + inspect( op ) );

log( '- now run task id: %s, with interval: %s', inspect( id1 ), inspect( interval1 ) );
op = qq.ttable[ id1 ].run( interval1 );

log( '- check #run operation result, should be: %s.', inspect( 1 ) );
assert.ok( op === 1, 'got: ' + inspect( op ) );

log( '- check interval for task id: %s, should be: %s.', inspect( id1 ), inspect( interval1 ) );
assert.equal( qq.ttable[ id1 ].status._idleTimeout, interval1, 'got: ' + inspect( op ) );

log( '- check Cucu.running property, should be: %s.', inspect( 2 ) );
assert.ok( qq.running === 2, 'got: ' + inspect( qq.running ) );

log( '- now try to re-run task id: %s.', inspect( id0 ) );
op = qq.ttable[ id0 ].run( 2000 );
log( '- check #run operation result, should be: %s.', inspect( 0 ) );
assert.ok( op === 0, 'got: ' + inspect( op ) );

log( '- now try to re-run task id: %s.', inspect( id1 ) );
op = qq.ttable[ id1 ].run( 2000 );

log( '- check #run operation result, should be: %s.', inspect( 0 ) );
assert.ok( op === 0, 'got: ' + inspect( op ) );

log( '- check Cucu.running property, should be: %s.', inspect( 2 ) );
assert.ok( qq.running === 2, 'got: ' + inspect( qq.running ) );

log( '- now try to re-run a non existent task id: %s.', inspect( null ) );
op = qq.run( null );

log( '- check #run operation result, should be: %s.', inspect( -1 ) );
assert.ok( op === -1, 'got: ' + inspect( op ) );

setTimeout( function () {

    log( '> now, stop scheduled tasks: %s.', inspect( [ id0, id1 ] ) );
    qq.ttable[ id0 ].stop();
    qq.ttable[ id1 ].stop();

    log( '- check scheduled task status, should be: %s.', inspect( -1 ) );
    assert.ok( ! ~ qq.ttable[ id0 ].status, 'got: ' + inspect( qq.ttable[ id0 ].status ) );

    log( '> now, del() tasks: %s.', inspect( [ id0, id1 ] ) );
    qq.ttable[ id0 ].del();
    qq.ttable[ id1 ].del();

    log( '- check if task cache is empty: %s.', inspect( qq.ttable ) );
    assert.deepEqual( qq.ttable, {} );

}, 3000 );