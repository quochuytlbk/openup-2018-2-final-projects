import angular from 'angular';

import loadingScreenTemplate from './loading-screen.html';

import { TimelineMax } from 'gsap/TweenMax';

const organizeModule = angular.module('app.main.organize');

organizeModule.component('loadingScreen', {
  template: loadingScreenTemplate,
  controller: function() {
    let vm = this;

    function runAnimation() {
      var tl = new TimelineMax();
      tl.from('#svg-logo-circle', 1, {
        opacity: 0,
        ease: Power2.easeOut
      });

      // Right Half Face
      new TimelineMax().from('#path432', 1, {
        scaleX: 0,
        opacity: 0,
        transformOrigin: 'right',
        ease: Circ.easeOut,
        delay: 1
      });

      // Left Half Face
      new TimelineMax().from('#path434', 1, {
        scaleX: 0,
        opacity: 0,
        transformOrigin: 'left',
        ease: Circ.easeOut,
        delay: 1
      });

      // Right Half Grey Part
      new TimelineMax().from('#path424', 1, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'center',
        ease: Circ.easeOut,
        delay: 1
      });

      // Left Half Grey Part
      new TimelineMax().from('#path426', 1, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'center',
        ease: Circ.easeOut,
        delay: 1
      });

      // Left Eye Area
      new TimelineMax().from('#path456', 1, {
        scaleY: 0,
        opacity: 0,
        transformOrigin: 'left',
        ease: Circ.easeOut,
        delay: 1
      });

      // Right Eye Area
      new TimelineMax().from('#path458', 1, {
        scaleY: 0,
        opacity: 0,
        transformOrigin: 'right',
        ease: Circ.easeOut,
        delay: 1
      });

      // Left Outer Ear
      new TimelineMax().from('#path436', 0.5, {
        scaleX: 0,
        opacity: 0,
        transformOrigin: 'right',
        ease: Circ.easeOut,
        delay: 2
      });

      // Left Inner Ear
      new TimelineMax().from('#path438', 0.5, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'right',
        ease: Circ.easeOut,
        delay: 2
      });

      // Right Outer Ear
      new TimelineMax().from('#path440', 0.5, {
        scaleX: 0,
        opacity: 0,
        transformOrigin: 'left',
        ease: Circ.easeOut,
        delay: 2
      });

      // Right Inner Ear
      new TimelineMax().from('#path442', 0.5, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'left',
        ease: Circ.easeOut,
        delay: 2
      });

      // Left Eye Black Area
      new TimelineMax().from('#path460', 0.5, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'left',
        ease: Circ.easeOut,
        delay: 2
      });

      // Left Eye Ball
      new TimelineMax().from('#path466', 1, {
        opacity: 0,
        transformOrigin: 'center',
        ease: Power2.easeOut,
        delay: 2.5
      });

      // Right Eye Black Area
      new TimelineMax().from('#path462', 0.5, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'right',
        ease: Circ.easeOut,
        delay: 2
      });

      // Right Eye Ball
      new TimelineMax().from('#path464', 1, {
        opacity: 0,
        transformOrigin: 'center',
        ease: Power2.easeOut,
        delay: 2.5
      });

      // Left Outer Nose
      new TimelineMax().from('#path444', 0.5, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'left',
        ease: Circ.easeOut,
        delay: 2
      });

      // Left Inner Nose
      new TimelineMax().from('#path448', 0.5, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'center',
        ease: Power2.easeOut,
        delay: 2.5
      });

      // Right Outer Nose
      new TimelineMax().from('#path452', 0.5, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'right',
        ease: Circ.easeOut,
        delay: 2
      });

      // Right Inner Nose
      new TimelineMax().from('#path454', 0.5, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'center',
        ease: Power2.easeOut,
        delay: 2.5
      });

      // Left Half Mouth
      new TimelineMax().from('#path428', 0.5, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'left',
        ease: Circ.easeOut,
        delay: 2
      });

      // Right Half Mouth
      new TimelineMax().from('#path430', 0.5, {
        scale: 0,
        opacity: 0,
        transformOrigin: 'right',
        ease: Circ.easeOut,
        delay: 2
      });
    }

    runAnimation();
  }
});
