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
    , op = -1
    ;

log( '- #add invalid "id": %s.', inspect( 3 ) );
op = qq.add( 3 );
assert.ok( ! ~ op );

log( '- #add invalid "fn": %s.', inspect( 'function' ) );
op = qq.add( 'function' );
assert.ok( ! ~ op );

log( '- #add invalid "args": %s.', inspect( -1 ) );
op = qq.add( 'id0', function(){}, -1 );
assert.ok( ! ~ op );