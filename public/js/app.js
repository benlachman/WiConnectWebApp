/*global Backbone:true,  _:true, $:true, App:true */
/*jshint browser:true */
/*jshint strict:false */

/*
  * WiConnect Web App, WiConnect JS API Library & WiConnect JS Build System
  *
  * Copyright (C) 2015, Sensors.com, Inc.
  * All Rights Reserved.
  *
  * The WiConnect Web App, WiConnect JavaScript API and WiConnect JS build system
  * are provided free of charge by Sensors.com. The combined source code, and
  * all derivatives, are licensed by Sensors.com SOLELY for use with devices
  * manufactured by ACKme Networks, or approved by Sensors.com.
  *
  * THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS AND ANY EXPRESS OR IMPLIED
  * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
  * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
  * SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT
  * OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
  * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
  * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
  * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
  * OF SUCH DAMAGE.
*/

if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

$(document).ready(function(){
  App.start();
});

var App = {
  self: this,
  Models: {},
  Views: {},
  views: {},
  menu: false,
  start: function(){

    var self = this;

    self.controller = new App.Models.Controller();
    self.device = new App.Models.Device({
      controller: App.controller
    });

    //leave the following line in place for local development with a remote device
    /*deviceHost*/

    self.device.init();

    var appViews = [
      {el: 'connect',           nav: 'Connect',         view: App.Views.Connect,          modes: ['wlan', 'softap', 'setup']},
      {el: 'network-settings',  nav: 'Network',         view: App.Views.NetworkSettings,  modes: ['wlan', 'softap']},
      {el: 'gpio-usage',        nav: 'GPIOs',           view: App.Views.GPIO,             modes: ['wlan', 'softap', 'setup']},
      {el: 'browser',           nav: 'Files',           view: App.Views.FileBrowser,      modes: ['wlan', 'softap', 'setup']},
      {el: 'system',            nav: 'System',          view: App.Views.System,           modes: ['wlan', 'softap', 'setup']},
      {el: 'firmware',          nav: 'Firmware',        view: App.Views.Firmware,         modes: ['wlan']},
      {el: 'cloud',             nav: 'Cloud Services',  view: App.Views.Cloud,            modes: ['wlan']}
    ];

    //create menu nav items and content holders for each application view
    _.each(appViews, function(thisView){
      var li = $('<li />'),
           a = $('<a />'),
         div = $('<div />');

      div.addClass(thisView.el);

      _.each(thisView.modes, function(mode) {
        li.addClass(mode);
      });

      a.attr('href', thisView.el);
      a.text(thisView.nav);

      a.appendTo(li);
      li.appendTo('.nav ul');
      div.insertBefore('.main .menu');

      self.views[thisView.el] = new thisView.view({
        el: $('.' + thisView.el),
        controller: App.controller,
        device: App.device
      });
    });

    self.views.loader = new App.Views.Loader({
      el: $('.loading'),
      controller: App.controller
    });

    Backbone.history.start({pushState: true});

    $(document).on('click', 'a:not([data-bypass])', function(e) {
      var href = $(this).attr("href");
      var protocol = this.protocol + "//";
      if (href.slice(0, protocol.length) !== protocol) {
        e.preventDefault();
        App.controller.set({view: href});
      }
      if(_.contains(['small', 'medium'], App.controller.get('size'))) {
        self.onMenu();
      }
    });
    $('.menu, .overlay').click(this.onMenu);
  },

  onMenu: function() {
    if(!App.menu){
      $('.main>.active').css({width: App.controller.get('width')});
      $('.nav').fadeIn(225);
    } else {
      $('.nav').fadeOut(375);
    }
    $('.main').toggleClass('nav-open');
    $('.overlay').toggle();
    App.menu = !App.menu;
  }
};
