
var observerTree;
var observerPanes;
var timeoutTree;
var timeoutPanes;
var timeoutTreeObserver;
var timeoutPanesObserver;
var View      = require('atom').View;
var __hasProp = {}.hasOwnProperty;
var __extends = function(child, parent) {
    for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
    }

    function ctor() {
        this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
};

var observerConfig = {
    attributes: true,
    childList: true,
    characterData: false,
    subtree: true
};

module.exports = FiletypeColorView = (function(_super) {
    __extends(FiletypeColorView, _super);

    function FiletypeColorView() {

        return FiletypeColorView.__super__.constructor.apply(this, arguments);
    }

    FiletypeColorView.content = function() {
        return this.div({
            //"class": 'filetype-color overlay from-top'
        }, (function(_this) {
            return function() {
                return;
                //_this.div("The FiletypeColor package is Alive! It's GONE!", {"class": "message"});
            };
        })(this));
    };

    FiletypeColorView.prototype.initialize = function(serializeState) {
        var autoInit = atom.config.get('filetype-color.enabled');

        if(!autoInit) {
            atom.config.set('filetype-color.enabled', 'false');
            autoInit = 'false';
        }

        if(autoInit == 'true') {
            var self = this;
            setTimeout(function(){
                self.toggle();
            }, 1000);
        }

        return atom.workspaceView.command("filetype-color:toggle", (function(_this) {
            return function() {
                return _this.toggle();
            };
        })(this));
    };

    FiletypeColorView.prototype.activate = function() {};

    FiletypeColorView.prototype.deactivate = function() {};

    FiletypeColorView.prototype.serialize = function() {};

    FiletypeColorView.prototype.destroy = function() {
        return this.detach();
    };

    FiletypeColorView.prototype.toggle = function() {

        if (this.hasParent()) {

            this.clearAll();
            this.clearAllPanes();

            if (observerTree) {
                observerTree.disconnect();
                observerPanes.disconnect();
            }

            atom.config.set('filetype-color.enabled', 'false');

            return this.detach();

        } else {

            if(document.querySelector('.tree-view')) {
                this.colorAll();
                this.createTreeViewObserver();
            }

            this.colorAllPanes();
            this.createPaneViewObserver();

            atom.config.set('filetype-color.enabled', 'true');

            return atom.workspaceView.append(this);
        }
    };

    FiletypeColorView.prototype.createPaneViewObserver = function(mutation) {

        var targetPanes = document.querySelector('.panes .pane ul');
        var self = this;

        observerPanes = new WebKitMutationObserver(function(mutations) {

            observerPanes.disconnect();

            mutations.forEach(function() {

                var that = self;

                clearTimeout(timeoutPanes);

                timeoutPanes = setTimeout(function() {
                    that.colorAllPanes();
                }, 100);

            });

            clearTimeout(timeoutPanesObserver);

            timeoutPanesObserver = setTimeout(function() {
                observerPanes.observe(targetPanes, observerConfig);
            }, 150);
        });

        observerPanes.observe(targetPanes, observerConfig);
    };

    FiletypeColorView.prototype.createTreeViewObserver = function(mutation) {

        var targetTree = document.querySelector('.tree-view');
        var self = this;

        observerTree = new WebKitMutationObserver(function(mutations) {

            observerTree.disconnect();

            mutations.forEach(function() {

                var that = self;

                clearTimeout(timeoutTree);

                timeoutTree = setTimeout(function() {
                    that.colorAll();
                }, 100);

            });

            clearTimeout(timeoutTreeObserver);

            timeoutTreeObserver = setTimeout(function() {
                observerTree.observe(targetTree, observerConfig);
            }, 150);
        });

        observerTree.observe(targetTree, observerConfig);
    };

    FiletypeColorView.prototype.attrModified = function(mutation) {
        // var name = mutation.attributeName,
        // newValue = mutation.target.getAttribute(name),
        // oldValue = mutation.oldValue;
        // console.log(name, newValue, oldValue);
        // console.log(mutation.target);
    };

    FiletypeColorView.prototype.colorAll = function() {

        treeView = document.querySelector(".tree-view");
        elements = treeView.querySelectorAll("li.file span");

        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            this.colorElement(el);
        }

    };

    FiletypeColorView.prototype.colorAllPanes = function() {

        paneView = document.querySelector(".panes");
        elements = paneView.querySelectorAll("li .title");

        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            this.colorElement(el);
        }
    };

    FiletypeColorView.prototype.clearAll = function() {
        if(document.querySelector('.tree-view'))
        {
            treeView = document.querySelector(".tree-view");
            elements = treeView.querySelectorAll("li.file span");

            for (var i = 0; i < elements.length; i++) {
                var el = elements[i];
                this.clearElement(el);
            }
        }
    };

    FiletypeColorView.prototype.clearAllPanes = function() {
        paneView = document.querySelector(".panes");
        elements = paneView.querySelectorAll("li .title");

        for (var i = 0; i < elements.length; i++) {
            var el = elements[i];
            this.clearElement(el);
        }
    };

    FiletypeColorView.prototype.colorElement = function(el) {
        var fileName = el.innerHTML;

        var ext = fileName.split('.').pop();
        var className = "filetype-color filetype-color-" + ext;
        this.clearElement(el);
        el.className = el.className + " " + className;
    };

    FiletypeColorView.prototype.clearElement = function(el) {
        el.className = el.className.replace(/\sfiletype-color-[\S]+/, '');
        el.className = el.className.replace('filetype-color', '');
    };

    return FiletypeColorView;

})(View);
