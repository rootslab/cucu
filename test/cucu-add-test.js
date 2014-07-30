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
    , id = 'task0'
    , fn = function () {
        var arr = slice.call( arguments )
            , env = this
            ;

        log( '> check fn scheduled task arguments, should be', inspect( args ) );
        assert.deepEqual( arr, args,  'got: ' + inspect( args ) );

        log( '> now, stop scheduled task.' );
        qq.stop( id );

        log( '- check scheduled task status, should be:', inspect( -1 ) );
        assert.ok( ! ~ qq.tasks[ id ].status, 'got: ' + inspect( qq.tasks[ id ].status ) );

        log( '> check fn scope, should be:', inspect( scope ) );
        assert.deepEqual( env, scope,  'got: ' + inspect( scope ) );
    }
    , args = [ 0, 1, 2, 3 ]
    , scope = { a : 1 }
    , interval = 1000
    , op = null
    ;

log( '- #add a task with id:', inspect( id ) );
op = qq.add( id, fn, args, scope, interval );

log( '- check #add operation result, should be:', inspect( 1 ) );
assert.ok( op === 1, 'got: ' + inspect( op ) );

log( '- re-#add the same task id:', inspect( id ) );
op = qq.add( id, fn, args, scope, interval );

log( '- check #add operation result, should be:', inspect( 1 ) );
assert.ok( op === 1, 'got: ' + inspect( op ) );

log( '- now run task id:', inspect( id ) );
op = qq.run( id );

log( '- #add the same task id:', inspect( id ) );
op = qq.add( id, fn, args, scope, interval );

log( '- check #add operation result, should fail with:', inspect( 0 ) );
assert.ok( op === 0, 'got: ' + inspect( op ) );