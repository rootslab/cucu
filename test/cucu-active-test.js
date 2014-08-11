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
    }
    , args = [ 0, 1, 2, 3 ]
    , scope = { a : 1 }
    , interval = 1000
    , interval0 = 700
    , interval1 = 1300
    , op = null
    , timetable = null
    ;

log( '- #add 2 tasks with id: %s.', inspect( [ id0, id1 ] ) );
op = qq.add( id0, fn0, args, scope, interval );
op = qq.add( id1, fn1, args, scope, interval );

log( '- now run task id: %s, with interval: %s.', inspect( id0 ), inspect( interval0 ) );
op = qq.run( id0, interval0 );

log( '- check #active result, should be: %s.', inspect( [ id0 ] ) );
assert.deepEqual( qq.active(), [ id0 ], 'got: ' + inspect( qq.active() ) );

log( '- now run task id: %s, with interval: %s.', inspect( id1 ), inspect( interval1 ) );
op = qq.run( id1, interval1 );

log( '- check #active result, should be: %s.', inspect( [ id0, id1 ] ) );
assert.deepEqual( qq.active(), [ id0, id1 ], 'got: ' + inspect( qq.active() ) );

log( '- #stop tasks, ids: %s.', inspect( [ id1, noid ] ) );
op = qq.stop( [ id1, noid ] );

log( '- check #active result, should be: %s.', inspect( [ id0 ] ) );
assert.deepEqual( qq.active(), [ id0 ], 'got: ' + inspect( qq.active() ) );

log( '- check if result length === Cucu.running, should be: %s.', inspect( qq.active().length ) );
assert.ok( qq.active().length === qq.running, 'got: ' + inspect( qq.running ) );

setTimeout( function () {

    timetable = qq.ttable[ id0 ].timetable();
    log( '- check timetable result for task %s: %s.', id0, inspect( timetable ) );
    assert.ok( timetable.times === 4 );
    assert.ok( ! ~ timetable.etime );

    log( '- #stop tasks, ids: %s.', inspect( [ id0 ] ) );
    op = qq.stop( [ id0 ] );

    timetable = qq.ttable[ id0 ].timetable();
    log( '- check timetable result for task %s: %s.', id0, inspect( timetable ) );
    assert.ok( ~ timetable.etime );

    log( '- check #active result, should be: %s.', inspect( [] ) );
    assert.deepEqual( qq.active(), [], 'got: ' + inspect( qq.active() ) );

    log( '-check #size result, should be %s.', inspect( 2 ) );
    assert.ok( qq.size(), 2 );

}, 3000 );