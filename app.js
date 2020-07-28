// Game logic
function Game(ui) {
  var cells = [];
  var gamestatus;
  var turn = -1;

  this.ready = function() {
    return turn >= 0 && turn < 25;
  };

  this.init = function() {
    console.log('game init');
    cells = [];
    for (var i = -2; i <= 2; i++) {
      cells[i] = [];
      for (var j = -2; j <= 2; j++) {
        var cell = cells[i][j] = {
          i : i,
          j : j
        };
        cells[i][j].ui = ui.cell(cells[i][j]);
      }
    }
  };

  this.start = function() {
    console.log('game start');
    if (cells.length == 0) {
      this.init();
    }
    turn = 0;
    for (var i = -2; i <= 2; i++) {
      for (var j = -2; j <= 2; j++) {
        cells[i][j].sign = null;
        cells[i][j].ui.update();
      }
    }
  };
  this.click = async function(cell) {
    console.log('game click');
    if (turn < 0 || cell.sign) {
      return;
    }
    cell.sign = (turn++ % 2 == 0) ? 'o' : 'x';
    await cell.ui.update();
    //var row = await test(cell.i, cell.j, cell.sign);
    var row=null;
    var i=cell.i;
    var j=cell.j;
    for(var m=-1;m<=1;m++){
      if(i+m>2||i+m<-2)continue;
      for(var n=-1;n<=1;n++){
        if(j+n<=2&&j+n>=-2 &&!(m==0&&n==0)){
          if(cells[i+m][j+n].sign == cell.sign){
            if(i+m*2>2||i+m*2<-2||j+n*2>2||j+n*2<-2){}
            else{
              if(cells[i+m*2][j+n*2].sign==cell.sign) {
                row= [ cells[i][j], cells[i+m][j+n], cells[i+2*m][j+2*n] ];
                break;
              }
            }
            if(i-m>2||i-m<-2||j-n>2||j-n<-2){}
            else{
              if(cells[i-m][j-n].sign==cell.sign){
                row= [ cells[i-m][j-n], cells[i][j], cells[i+m][j+n] ];
                break;
              }
            }
          }
        }
      }
    }
    if (row) {
      turn = -1;
      await ui.win(row, cell.sign);
    } else {
      if (turn >= 25) {
      turn = -1;
      await ui.draw();
      }
      else{
        var x;
        var y
        while(true){
          x=parseInt(Math.random() * (4 - 0) -2);
          y=parseInt(Math.random() * (4 - 0) -2);
          if(cells[x][y].sign==null){
            turn++;
            cells[x][y].sign='x';
            cells[x][y].ui.img.image('x').pin({
              alpha : 0.8,
              scale : 1
            });
            var row1=null;
            var i1=cells[x][y].i;
            var j1=cells[x][y].j;

            for(var m=-1;m<=1;m++){
              if(i1+m>2||i1+m<-2)continue;
              for(var n=-1;n<=1;n++){
                if(j1+n<=2&&j1+n>=-2 &&!(m==0&&n==0)){
                  if(cells[i1+m][j1+n].sign == cells[x][y].sign){
                    if(i1+m*2>2||i1+m*2<-2||j1+n*2>2||j1+n*2<-2){}
                    else{
                      if(cells[i1+m*2][j1+n*2].sign==cells[x][y].sign) {
                        row1= [ cells[i1][j1], cells[i1+m][j1+n], cells[i1+2*m][j1+2*n] ];
                        break;
                      }
                    }
                    if(i1-m>2||i1-m<-2||j1-n>2||j1-n<-2){}
                    else{
                      if(cells[i1-m][j1-n].sign==cells[x][y].sign){
                        row1= [ cells[i1-m][j1-n], cells[i1][j1], cells[i1+m][j1+n] ];
                        break;
                      }
                    }
                  }
                }
              }
            }

            if (row1) {
              turn = -1;
              ui.win(row1, cells[x][y].sign);
            }
            else if(turn >= 25) {
              turn = -1;
              ui.draw();
            }
            break;
          }
        }
      }
    }
  };

  this.start = function() {
    console.log('game start');
    if (cells.length == 0) {
      this.init();
    }
    turn = 0;
    for (var i = -2; i <= 2; i++) {
      for (var j = -2; j <= 2; j++) {
        cells[i][j].sign = null;
        cells[i][j].ui.update();
      }
    }
  };
  
}

// UI

Stage(function(stage) {

  stage.viewbox(50, 50).pin('handle', -0.5);

  Stage.image('bg').pin('handle', 0.5).appendTo(stage);

  var game = new Game({
    cell : function(obj) {
      console.log('ui new cell');
      var img = Stage.image('x').appendTo(stage).pin({
        offsetX : obj.i * 10,
        offsetY : obj.j * 10,
        handle : 0.5
      }).on('click', function() {
        if (game.ready()) {
          game.click(obj);
        } else {
          game.start();
        }
      });
      return {
        img,
        update : function() {
          console.log('ui update cell');
          img.image(obj.sign || '-').pin({
            alpha : 0.8,
            scale : 1
          });
        },
        win : function() {
          img.tween(200).pin({
            alpha : 1,
            scale : 1.2,
          });
        }
      };
    },
    win : function(row, sign) {
      console.log('ui win');
      
      for (var i = 0; i < row.length; i++) {
        row[i].ui.win();
      }
    },
    draw : function() {
      console.log('ui draw');
    }
  });

  game.start();
});

// Textures
Stage({
  textures : {
    'bg' : Stage.canvas(function(ctx) {
      var ratio = 20;
      this.size(50, 50, ratio);
      ctx.scale(ratio, ratio);
      ctx.moveTo(10, 1);
      ctx.lineTo(10, 49);
      ctx.moveTo(20, 1);
      ctx.lineTo(20, 49);
      ctx.moveTo(30, 1);
      ctx.lineTo(30, 49);
      ctx.moveTo(40, 1);
      ctx.lineTo(40, 49);
      ctx.moveTo(1, 10);
      ctx.lineTo(49, 10);
      ctx.moveTo(1, 20);
      ctx.lineTo(49, 20);
      ctx.moveTo(1, 30);
      ctx.lineTo(49, 30);
      ctx.moveTo(1, 40);
      ctx.lineTo(49, 40);
      ctx.lineWidth = 0.3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#999';
      ctx.stroke();
    }),
    'x' : Stage.canvas(function(ctx) {
      var ratio = 20;
      this.size(10, 10, ratio);
      ctx.scale(ratio, ratio);
      ctx.moveTo(2, 2);
      ctx.lineTo(8, 8);
      ctx.moveTo(2, 8);
      ctx.lineTo(8, 2);
      ctx.lineWidth = 0.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
      ctx.stroke();
    }),
    'o' : Stage.canvas(function(ctx) {
      var ratio = 20;
      this.size(10, 10, ratio);
      ctx.scale(ratio, ratio);
      ctx.arc(5, 5, 2.4, 0, 2 * Math.PI);
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#000';
      ctx.stroke();
    }),
    '-' : Stage.canvas(function(ctx) {
      var ratio = 20;
      this.size(10, 10, ratio);
    })
  }
});