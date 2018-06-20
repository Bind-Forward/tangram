// Tangram main API
//
// example:
//
// `var map = Tangram.tangramLayer('map');`
//
// This will create a Tangram map in the DOM element (normally a div) called 'map'.


import Thread from './utils/thread';
import Scene from './scene';
import * as interaction from './interaction';

var tangramLayer;
export function tangramLayer(id, options) {
  if (Thread.is_main) {
    return {
      container: document.getElementById(id),

      initialize (options) {
      // Defaults
        if (!this.hasOwnProperty('options')) {
            this.options = this.options ? create(this.options) : {};
        }
        for (var i in options) {
            this.options[i] = options[i];
        }

        this.scene = Scene.create();

        // Add GL canvas to map this.container
        this.scene.container = this.container;

        // Initial view
        this.updateView(this);

        this.scene.load(
            this.options.scene, {}
        ).then(() => {

          this.updateSize(this);
          interaction.init(this);

        }).catch(error => {
            throw(error);
        });
      },
      
      getCenter: function() {
        return this.scene.view.center;
      },

      getZoom: function() {
        return this.scene.view.zoom;
      },

      setView: function (view) {
        this.scene.view.setView(view);
      },

      updateView: function (map) {
        var view = map._lastCenter;
        view.zoom = map._zoom;
        map.scene.view.setView(view);
      },

      updateSize: function (map) {
        var size = {x: this.container.clientWidth, y: this.container.clientHeight};
        map.scene.resizeMap(size.x, size.y);
      }
    };
  }
}
