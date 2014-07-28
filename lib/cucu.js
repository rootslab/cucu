/*
 * Cucu, a tiny module to schedule repeated execution of (single process) methods/tasks.
 *
 * Copyright(c) 2013 Guglielmo Ferri <44gatti@gmail.com>
 * MIT Licensed
 */

exports.version = require( '../package' ).version;
exports.Cucu = ( function () {
    var log = console.log
        , emptyFn = function () {}
        , emitter = require( 'events' ).EventEmitter
        , util = require( 'util' )
        , Bolgia = require( 'bolgia' )
        , doString = Bolgia.doString
        , improve = Bolgia.improve
        , clone = Bolgia.clone
        , ooo = Bolgia.circles
        , oarr = ooo.arr 
        , ostr = ooo.str
        , ofun = ooo.fun
        , keys = Object.keys
        , isArray = Array.isArray
        // Cucu
        , Cucu = function () {
            var me = this
                ;
            if ( ! ( me instanceof Cucu ) ) {
                return new Cucu();
            }
            me.tasks = {};
            me.running = 0;
        }
        , cproto = null
        ;

    util.inherits( Cucu, emitter );

    cproto = Cucu.prototype;

    cproto.add = function ( id, fn, args, scope, interval ) {
        var me = this
            , tasks = me.tasks
            , task = null
            ;
        if ( doString( id ) !== ostr ) return -1;
        if ( doString( fn ) !== ofun ) return -1;
        if ( args && ( doString( args ) !== oarr ) ) return -1;

        task = tasks[ id ];
        // check if there is a task running with this name/id
        if ( task && ~ task.status ) return -1;
        // add task
        tasks[ id ] = task = {
            id : id
            , args : [ scope ? fn.bind( scope ) : fn, +interval || 1000 ].concat( args )
            , status : -1
        };
        return 1;
    };

    cproto.run = function ( id, interval ) {
        var me = this
            , task = me.tasks[ id ]
            ;
        if ( ! task ) return -1;
        if ( + interval ) task.args[ 1 ] = interval;
        if ( ~ task.status ) return 0;
        task.status = setInterval.apply( me, task.args );
        ++me.running;
        return 1;
    };

    cproto.del = function ( id_list ) {
        var me = this
            , ids = isArray( id_list ) ? id_list : [ String( id_list ) ]
            , tasks = me.tasks
            , task = null
            , t = null
            , list = []
            , id = null
            ;
        if ( ! ids.length ) return [];
        for ( t in ids ) {
            id = ids[ t ];
            task = tasks[ id ];
            // check if task exists and if it is running
            if ( ! task || ( task && ~ task.status ) ) continue;
            delete tasks[ id ];
            list.push( id );
        };
        return list;
    };

    cproto.stop = function ( id_list ) {
        var me = this
            , ids = isArray( id_list ) ? id_list : [ String( id_list ) ]
            , tasks = me.tasks
            , task = null
            , t = null
            , list = []
            , id = null
            ;
        if ( ! ids.length ) return [];
        for ( t in ids ) {
            id = ids[ t ];
            task = tasks[ id ];
            if ( task && ~ task.status ) {
                clearInterval( task.status );
                task.status = -1;
                --me.running;
                list.push( id );
            }
        };
        return list;
    };

    cproto.awake = function () {
        var me = this
            , tasks = me.tasks
            , t = null
            , list = []
            ;
        // start all non-running tasks
        for ( t in tasks ) {
            if ( ~ tasks[ t ].status ) continue;
            me.run( t );
            list.push( t );
        };
        return list;
    };

    cproto.halt = function () {
        var me = this
            , tasks = me.tasks
            , t = null
            , list = []
            ;
        // stop all running tasks
        for ( t in tasks ) {
            if ( ~ tasks[ t ].status ) {
                me.stop( t );
                --me.running;
                list.push( t );
            }
        };
        return list;
    };

    cproto.flush = function () {
        var me = this
            , tasks = me.tasks
            , t = null
            , list = []
            ;
        // delete/stop all tasks
        for ( t in tasks ) {
            if ( ~ tasks[ t ].status ) {
                me.stop( t );
                --me.running;
            }
            delete tasks[ t ];
            list.push( t );
        };
        return list;
    };

    cproto.active = function () {
        var me = this
            , tasks = me.tasks
            , t = null
            , list = []
            ;
        // get a list of names/ids for all currently active/running tasks
        for ( t in tasks ) if ( ~ tasks[ t ].status ) list.push( t );
        return list;
    };

    cproto.size = function () {
        var me = this
            ;
        return keys( me.tasks ).length;
    };

    return Cucu;

} )();