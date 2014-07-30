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
        log( '> check fn scope, should be:', inspect( scope ) );
        assert.deepEqual( this, scope,  'got: ' + inspect( this ) );
    }
    , fn1 = function () {
        log( '> scheduled task %s.', inspect( id1 ) );
    }
    , args = [ 0, 1, 2, 3 ]
    , scope = { a : 1 }
    , interval = 1000
    , op = null
    ;

log( '- #add 2 tasks with id:', inspect( [ id0, id1 ] ) );
op = qq.add( id0, fn0, args, scope, interval );
op = qq.add( id1, fn1, args, scope, interval );

log( '- now run task id:', inspect( id0 ) );
op = qq.run( id0 );

log( '- check #run operation result, should be:', inspect( 1 ) );
assert.ok( op === 1, 'got: ' + inspect( op ) );

log( '- now run task id:', inspect( id1 ) );
op = qq.run( id1 );

log( '- check #run operation result, should be:', inspect( 1 ) );
assert.ok( op === 1, 'got: ' + inspect( op ) );

log( '- check Cucu.running property, should be:', inspect( 2 ) );
assert.ok( qq.running === 2, 'got: ' + inspect( qq.running ) );

log( '- now try to re-run task id:', inspect( id0 ) );
op = qq.run( id0 );

log( '- check #run operation result, should be:', inspect( 0 ) );
assert.ok( op === 0, 'got: ' + inspect( op ) );

log( '- now try to re-run task id:', inspect( id1 ) );
op = qq.run( id1 );

log( '- check #run operation result, should be:', inspect( 0 ) );
assert.ok( op === 0, 'got: ' + inspect( op ) );

log( '- check Cucu.running property, should be:', inspect( 2 ) );
assert.ok( qq.running === 2, 'got: ' + inspect( qq.running ) );

log( '- now try to re-run a non existent task id:', inspect( null ) );
op = qq.run( null );

log( '- check #run operation result, should be:', inspect( -1 ) );
assert.ok( op === -1, 'got: ' + inspect( op ) );

setTimeout( function () {
    log( '> now, stop scheduled tasks: %s.', inspect( [ id0, id1 ] ) );
    qq.stop( [ id0, id1 ] );

    log( '- check scheduled task status, should be:', inspect( -1 ) );
    assert.ok( ! ~ qq.tasks[ id0 ].status, 'got: ' + inspect( qq.tasks[ id0 ].status ) );

}, 4000 );