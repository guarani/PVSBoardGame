(function() {

    Bord.options = {};

    /* 
     * @function init   - Create a new board.
     * @param options   - 
     *     @param id {string}       - The HTML id of the board. 
     *     @param classes {string}  - HTML classes of the board. 
     */
    Bord.init = function(options) {

        Bord.options = options;
        Bord.boardState = new Array(options.rows);

        for (var i = 0; i < options.rows; i++) {
            Bord.boardState[i] = Array.apply(null, new Array(options.columns)).map(Number.prototype.valueOf,0);
        }

        document.ontouchmove = function(event){
            event.preventDefault();
        }

        // Set the defaults, if necessary.
        options = $.extend({}, options, {
            id      : 'my-board',
        });

        options.classes = ['Bord-board'];
        if (options.size === 'full-size') {
            options.classes.push('Bord-board-full-size')
        }


        var $board = $('<div></div>');
        $board.attr('id', options.id);
        $board.attr('class', options.classes.join(' ') || null);

        if (options.onSquareClicked) {
            $board.click(function(e) {
                var x = e.pageX - $(this).offset().left;
                var y = e.pageY - $(this).offset().top;
                var element = document.elementFromPoint(x, y);    
                var elementCol = $(element).index() % options.columns;
                var elementRow = Math.floor($(element).index() / options.columns);
                options.onSquareClicked(options, elementCol, elementRow);
            });
        }

/*
        $board.on('touchstart', function(e) {
            var x = e.originalEvent.touches[0].pageX - $(this).offset().left;
            var y = e.originalEvent.touches[0].pageY - $(this).offset().top;
            var element = document.elementFromPoint(x, y);    
            var elementCol = $(element).index() % options.columns;
            var elementRow = Math.floor($(element).index() / options.columns);
            options.onSquareTouchStart(options, elementCol, elementRow);

        });
        */
        $board.on('touchend', function(e) {
            var x = e.originalEvent.changedTouches[0].pageX - $(this).offset().left;
            var y = e.originalEvent.changedTouches[0].pageY - $(this).offset().top;
            var element = document.elementFromPoint(x, y);    
            var elementCol = $(element).index() % options.columns;
            var elementRow = Math.floor($(element).index() / options.columns);
            options.onSquareTouchEnd(options, elementCol, elementRow);

        });
        $board.on('touchmove', function(e) {
            var x = e.originalEvent.touches[0].pageX - $(this).offset().left;
            var y = e.originalEvent.touches[0].pageY - $(this).offset().top;
            var element = document.elementFromPoint(x, y);    
            var elementCol = $(element).index() % options.columns;
            var elementRow = Math.floor($(element).index() / options.columns);
            options.onSquareTouchMove(options, elementCol, elementRow);

        });




        

        for (var row = 0; row < options.rows; row++) {
            for (var col = 0; col < options.columns; col++) {

                var widthPercentage = 100 / options.columns;
                var heightPercentage = 100 / options.rows;

                $square = Bord.square({
                    width           : widthPercentage,
                    height          : heightPercentage,
                    backgroundColor : options.backgroundColor, 
                    borders         : Bord.SQUARE_BORDER_RIGHT | Bord.SQUARE_BORDER_BOTTOM,
                    
                });

                var xOffsetPercentage = col * widthPercentage; 
                var yOffsetPercentage = row * heightPercentage;
                $square.css({
                    position: 'absolute',
                    'top'   : yOffsetPercentage + '%',
                    'left'  : xOffsetPercentage + '%',
                });

                $board.append($square);

            }
        }

        Bord.board = $board;
        return $board;

    };


    Bord.setSquareAtColumnRowColor = function(col, row, isPlayer1) {
        Bord.boardState[row][col] = 1;
        var index = (Bord.options.columns * row) + col;
        var square = Bord.board.children().eq(index);
        if (isPlayer1) {
            square.css('backgroundColor', 'rgb(255,127,80)');
        } else {
            square.css('backgroundColor', 'rgb(102,205,70)');
        }
        
    };
    
    Bord.SQUARE_BORDER_TOP       = 0x1;
    Bord.SQUARE_BORDER_RIGHT     = 0x2;
    Bord.SQUARE_BORDER_BOTTOM    = 0x4;
    Bord.SQUARE_BORDER_LEFT      = 0x8;

    /*
     * @function square                 - Return a board square jQuery object.
     * @param options {object}          - The square configuration.
     *     @param width {number}        - The square's width (px).
     *     @param height {number}       - The square's height (px).
     *     @param extraClasses {string} - A space-delimited list of extra clases.
     *     @param borders {number}      -    
     *
     */
     /*
        0     0
        1     1
       10     2
       11     3
      100     4
      101     5
      110     6
      111     7
     1000     8

     10010  12
     */
    Bord.square = function(options) {

        // Set the defaults, if necessary.
        options = $.extend({}, options, {
               
        });

        var $sqr = $('<div></div>');
        $sqr.css({
            width                   : options.width + '%',
            height                  : options.height + '%',
            backgroundColor         : options.backgroundColor,    
            boxSizing               : 'border-box',
        });

        if (options.borders & Bord.SQUARE_BORDER_TOP) {
            $sqr.css('border-top', 'solid white');
        }
        if (options.borders & Bord.SQUARE_BORDER_RIGHT) {
            $sqr.css({'border-right-style': 'solid', 'border-right-color': 'DodgerBlue'});
        }
        if (options.borders & Bord.SQUARE_BORDER_BOTTOM) {
            $sqr.css({'border-bottom-style': 'solid', 'border-bottom-color': 'DodgerBlue'});
        }
        if (options.borders & Bord.SQUARE_BORDER_LEFT) {
            $sqr.css('border-left', 'solid white');
        }

        /*
        if (options.pattern === 'grid') {
            $sqr.addClass('Bord-square-grid');
        }

        if (options.row === options.rows - 1) {
            $sqr.addClass('Bord-square-grid-bottom-border');
        }
        */

        return $sqr;
        
    };
    
})(window.Bord = window.Bord || {});
