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
    , cnt0 = 0
    , cnt1 = 0
    , t0 = 15
    , t1 = 9
    , interval0 = 100
    , interval1 = 200
    , interval = 1000
    , fn0 = function ( done ) {
        log( '> %s, left: %s.', inspect( id0 ), inspect( qq.ttable[ id0 ].left ) );
        ++cnt0;
        // call done
        done();
    }
    , fn1 = function ( done ) {
        log( '> %s, left: %s.', inspect( id1 ), inspect( qq.ttable[ id1 ].left ) );
        arr = slice.call( arguments );
        if ( ++cnt1 === 1 ) {
            log( '> check fn1 arguments, should be: %s.', inspect( otherargs ) );
            assert.deepEqual( arr, [ done ].concat( otherargs ), 'got: ' + inspect( arr ) );
        }
        // call done
        done();
    }
    , arr = null
    , args = [ 0, 1, 2, 3 ]
    , otherargs = [ 9, 99, 999 ]
    , scope = { a : 1 }
    , op = null
    ;

log( '- #add 2 tasks with id:', inspect( [ id0, id1 ] ) );
op = qq.add( id0, fn0, args, scope, interval );
op = qq.add( id1, fn1, args, scope, interval );

log( '- now run task id: %s, with interval: %s', inspect( id0 ), inspect( interval0 ) );
op = qq.run( id0, interval0, null, t0 );

log( '- now run task id: %s, with interval: %s', inspect( id1 ), inspect( interval1 ) );
op = qq.run( id1, interval1, otherargs, t1 );

setTimeout( function () {

    log( '> check if scheduled task %s was executed %s times.', inspect( id1 ), inspect( t0 ) );
    assert.ok( cnt0 === t0 );

    log( '> check if scheduled task %s was executed %s times.', inspect( id1 ), inspect( t1 ) );
    assert.ok( cnt1 === t1 );
 
    log( '- check scheduled task status, should be: %s.', inspect( -1 ) );
    assert.ok( ! ~ qq.ttable[ id0 ].status, 'got: ' + inspect( qq.ttable[ id0 ].status ) );

}, 2500 );