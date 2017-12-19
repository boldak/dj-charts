'use strict';
const lib = require('./client-lib.js');

const text = `digraph G {

  subgraph cluster_0 {
    style=filled;
    color=lightgrey;
    node [style=filled,color=white];
    a0 -> a1 -> a2 -> a3;
    label = "process #1";
  }

  subgraph cluster_1 {
    node [style=filled];
    b0 -> b1 -> b2 -> b3;
    label = "process #2";
    color=blue
  }
  start -> a0;
  start -> b0;
  a1 -> b3[color="red"];
  a1[color=blue];
  b2 -> a3;
  a3 -> a0;
  a3 -> end;
  b3 -> end;

  start [shape=Mdiamond];
  end [shape=Msquare];
}`;

//required
//erases previous config
//dot syntax text
lib.setText(text);

//optional
//default: 'svg'
// <'svg'|'xdot'|'plain'|'ps'|'json'|'png'>
lib.setFormat('svg');

//optional
//default: 'dot'
// <'circo'|'dot'|'neato'|'osage'|'twopi'>
lib.setEngine('dot');

//optional
//may be used both, one or none of them
//in case of usage of one of them other scales by first
lib.setWidth(500);
lib.setHeigth(900);

//returns Promise
lib.getUrl()
  .then((url) => console.log(url));
