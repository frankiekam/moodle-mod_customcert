M.mod_customcert = {};


M.mod_customcert.rearrange = {

    /**
     * The custom certificate elements to display.
     */
    elements : Array(),

    /**
     * Store the X coordinates of the top left of the pdf div.
     */
    pdfx : 0,

    /**
     * Store the Y coordinates of the top left of the pdf div.
     */
    pdfy : 0,

    /**
     * Store the width of the pdf div.
     */
    pdfwidth : 0,

    /**
     * Store the height of the pdf div.
     */
    pdfheight : 0,

    /**
     * Store the location of the element before we move.
     */
    elementxy : 0,

    /**
     * The number of pixels in a mm.
     */
    pixelsinmm : '3.779528',

    /**
     * Initialise.
     *
     * @param Y
     * @param elements
     */
    init : function(Y, elements) {
        // Set the elements.
        this.elements = elements;

        // Set the PDF dimensions.
        this.pdfx = Y.one('#pdf').getX();
        this.pdfy = Y.one('#pdf').getY();
        this.pdfwidth = parseInt(Y.one('#pdf').getComputedStyle('width'), 10);
        this.pdfheight = parseInt(Y.one('#pdf').getComputedStyle('height'), 10);

        this.set_positions(Y);
        this.create_events(Y);
    },

    /**
     * Sets the current position of the elements.
     *
     * @param Y
     */
    set_positions : function(Y) {
        // Go through the elements and set their positions.
        for (var key in this.elements) {
            var element = this.elements[key];
            var posx = this.pdfx + parseInt(element['posx'] * this.pixelsinmm, 10);
            var posy = this.pdfy + parseInt(element['posy'] * this.pixelsinmm, 10);
            Y.one('#element-' + element['id']).setX(posx);
            Y.one('#element-' + element['id']).setY(posy);
        }
    },

    /**
     * Creates the JS events for changing element positions.
     *
     * @param Y
     */
    create_events : function(Y) {
        // Trigger a save event when save button is pushed.
        Y.one('.savepositionsbtn input[type=submit]').on('click', function(e) {
            this.save_positions(e);
        }, this);

        // Define the container and the elements that are draggable.
        var del = new Y.DD.Delegate({
            container: '#pdf',
            nodes: '.element'
        });

        // When we start dragging keep track of it's position as we may set it back.
        del.on('drag:start', function() {
            var node = del.get('currentNode');
            this.elementxy = node.getXY();
        }, this);

        // When we finish the dragging action check that the node is in bounds,
        // if not, set it back to where it was.
        del.on('drag:end', function() {
            var node = del.get('currentNode');
            if (this.is_out_of_bounds(node)) {
                node.setXY(this.elementxy);
            }
        }, this);
    },

    /**
     * Returns true if any part of the element is placed outside of the PDF div, false otherwise.
     *
     * @param node
     * @returns {boolean}
     */
    is_out_of_bounds : function(node) {
        // Get the width and height of the node.
        var nodewidth = parseInt(node.getComputedStyle('width'), 10);
        var nodeheight = parseInt(node.getComputedStyle('height'), 10);

        // Store the positions of each edge of the node.
        var left = node.getX();
        var right = left + nodewidth;
        var top = node.getY();
        var bottom = top + nodeheight;

        // Check if it is out of bounds horizontally.
        if ((left < this.pdfx) || (right > (this.pdfx + this.pdfwidth)))  {
            return true;
        }

        // Check if it is out of bounds vertically.
        if ((top < this.pdfy) || (bottom > (this.pdfy + this.pdfheight)))  {
            return true;
        }

        return false;
    },

    /**
     * Perform an AJAX call and save the positions of the elements.
     *
     * @param e
     */
    save_positions : function(e) {
        // The parameters to send the AJAX call.
        var params = {
            cmid: '',
            values: []
        };

        // Go through the elements and save their positions.
        for (var key in this.elements) {
            var element = this.elements[key];
            var node = Y.one('#element-' + element['id']);

            // Get the current X and Y positions for this element.
            var posx = parseInt((node.getX() - this.pdfx) / this.pixelsinmm, 10);
            var posy = parseInt((node.getY() - this.pdfy) / this.pixelsinmm, 10);

            // Set the parameters to pass to the AJAX request.
            params.values.push({
                id: element['id'],
                posx: posx,
                posy: posy
            });
        }

        // Save these positions.
        Y.io(M.cfg.wwwroot + '/mod/customcert/rest.php', {
            method: 'POST',
            data: params,
            on: {
                failure: function(tid, response) {
                    this.ajax_failure(response);
                    e.preventDefault();
                }
            },
            context: this
        })

    },

    /**
     * Handles any failures during an AJAX call.
     *
     * @param response
     * @returns {M.core.exception}
     */
    ajax_failure : function(response) {
        var e = {
            name: response.status + ' ' + response.statusText,
            message: response.responseText
        };
        return new M.core.exception(e);
    }
}