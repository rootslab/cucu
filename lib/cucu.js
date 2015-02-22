/*
 * Cucu, a tiny module to schedule repeated execution of (single process) methods/ttable.
 *
 * Copyright(c) 2015 Guglielmo Ferri <44gatti@gmail.com>
 * MIT Licensed
 */

exports.version = require( '../package' ).version;
exports.Cucu = ( function () {
    var emitter = require( 'events' ).EventEmitter
        , util = require( 'util' )
        , Bolgia = require( 'bolgia' )
        , doString = Bolgia.doString
        , ooo = Bolgia.circles
        , oarr = ooo.arr 
        , ostr = ooo.str
        , ofun = ooo.fun
        , onum = ooo.num
        , keys = Object.keys
        , isArray = Array.isArray
        , abs = Math.abs
        // Cucu
        , Cucu = function () {
            var me = this
                , is = me instanceof Cucu
                ;
            if ( ! is ) return new Cucu();
            me.ttable = {};
            me.running = 0;
        }
        , cproto = null
        ;

    util.inherits( Cucu, emitter );

    cproto = Cucu.prototype;

    cproto.add = function ( id, fn, args, scope, interval ) {
        var me = this
            , ttable = me.ttable
            , task = null
            , intval = interval && doString( interval ) === onum ? abs( interval ) : -1
            ;
        if ( doString( id ) !== ostr ) return -1;
        if ( doString( fn ) !== ofun ) return -1;
        if ( args && doString( args ) !== oarr ) return -1;

        task = ttable[ id ];
        // check if there is a task running with this name/id
        if ( task && ~ task.status ) return 0;
        // add task
        ttable[ id ] = {
            id : id
            , fn : function () {
                // get iteration timestamp
                ttable[ id ].itime = Date.now();
                return fn.apply( scope, arguments );
            }
            , interval : intval
            , args : args
            , scope : scope
            , left : -1
            , status : -1
            , stime : -1
            , itime : -1
            , etime : -1
            , timetable : function () {
                var task = ttable[ id ]
                    ;
                return {
                    tleft : ~ task.status ? task.interval - ( ~ task.itime ? Date.now() - task.itime : Date.now() - task.stime ) : -1
                    , times : ~ task.itime ? + ( ( task.itime - task.stime ) / task.interval ).toFixed( 0 ) : 0
                    , stime : task.stime
                    , itime : task.itime
                    , etime : task.etime
                    , h24 : Math.ceil( 24 * 60 * 60 * 1000 / task.interval )
                };
            }
            , run : me.run.bind( me, id )
            , stop : me.stop.bind( me, id )
            , del : me.del.bind( me, id )
        };
        return 1;
    };

    cproto.run = function ( id, interval, args, times ) {
        var me = this
            , task = me.ttable[ id ]
            , intval = interval && doString( interval ) === onum ? abs( interval ) : -1
            , t = times && doString( times ) === onum ? abs( times - 1 ) : -1
            , sargs = null
            , targs = null
            , now = -1
            , tfn = function () {
                task.fn.apply( task.scope || me, arguments );
                now = Date.now();
            }
            , done = function ( tsk ) {
                return function () {
                    if ( tsk.left > 0 ) return --tsk.left;
                    clearInterval( tsk.status );
                    // get end timestamp
                    tsk.etime = now;
                    tsk.status = -1;
                    tsk.left = -1;
                    --me.running;
                };
            }
            ;
        if ( ! task ) return -1;
        if ( ~ task.status ) return 0;
        if ( ~ intval ) task.interval = intval;
        task.left = t;
        sargs = [ ~ t ? tfn : task.fn.bind( task.scope || me ), task.interval ];
        targs = ( t > 0 ? [ done( task ) ] : [] ).concat( isArray( args ) ? args : task.args );
        // get start timestamp
        task.stime = Date.now();
        task.status = setInterval.apply( me, sargs.concat( targs ) );
        ++me.running;
        return 1;
    };

    cproto.del = function ( id_list ) {
        var me = this
            , ids = isArray( id_list ) ? id_list : [ String( id_list ) ]
            , ttable = me.ttable
            , task = null
            , t = null
            , list = []
            , id = null
            ;
        if ( ! ids.length ) return [];
        for ( t in ids ) {
            id = ids[ t ];
            task = ttable[ id ];
            // check if task exists and if it is running
            if ( ! task || ( task && ~ task.status ) ) continue;
            delete ttable[ id ];
            list.push( id );
        }
        return list;
    };

    cproto.stop = function ( id_list ) {
        var me = this
            , ids = isArray( id_list ) ? id_list : [ String( id_list ) ]
            , ttable = me.ttable
            , task = null
            , t = null
            , list = []
            , id = null
            ;
        if ( ! ids.length ) return [];
        for ( t in ids ) {
            id = ids[ t ];
            task = ttable[ id ];
            if ( task && ~ task.status ) {
                clearInterval( task.status );
                // get end timestamp
                task.etime = Date.now();
                task.status = -1;
                --me.running;
                list.push( id );
            }
        }
        return list;
    };

    cproto.awake = function () {
        var me = this
            , ttable = me.ttable
            , t = null
            , list = []
            ;
        // start all non-running ttable
        for ( t in ttable ) {
            if ( ~ ttable[ t ].status ) continue;
            me.run( t );
            list.push( t );
        }
        return list;
    };

    cproto.halt = function () {
        var me = this
            , ttable = me.ttable
            , t = null
            , list = []
            ;
        // stop all running ttable
        for ( t in ttable ) {
            if ( ~ ttable[ t ].status ) {
                me.stop( t );
                list.push( t );
            }
        }
        return list;
    };

    cproto.flush = function () {
        var me = this
            , ttable = me.ttable
            , t = null
            , list = []
            ;
        // delete/stop all ttable
        for ( t in ttable ) {
            if ( ~ ttable[ t ].status ) {
                me.stop( t );
            }
            delete ttable[ t ];
            list.push( t );
        }
        return list;
    };

    cproto.active = function () {
        var me = this
            , ttable = me.ttable
            , t = null
            , list = []
            ;
        // get a list of names/ids for all currently active/running ttable
        for ( t in ttable ) if ( ~ ttable[ t ].status ) list.push( t );
        return list;
    };

    cproto.size = function () {
        var me = this
            ;
        return keys( me.ttable ).length;
    };

    return Cucu;

} )();