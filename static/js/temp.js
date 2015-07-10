;(function (TEMP, undefined) {
	var _ = require('ep_etherpad-lite/static/js/underscore');
	var $ = require('ep_etherpad-lite/static/js/rjquery').$;
	'use strict';

	TEMP.temp = new function () {
		this.aceInitialized = _.bind (function (hook, context) {
			// store a reference to the context with the documentAttributeManager
			this.editorContext = context;
		}, this);

		this.aceRegisterBlockElements = function() {
  			return ['x-whatever'];
		}

		var lastCallstackType = null;
		this.aceEditEvent = _.bind (function (type, context, cb) {
			// if there was a change in the document then add an attribute to the current line
			if (context.callstack.docTextChanged) {
				if (lastCallstackType != "idleWorkTimer") {
					// run this at the first idleWorkTimer after keypress, when the caret has already moved after editing
					if (context.rep.selEnd) {
						this.editorContext
							.documentAttributeManager
							.setAttributeOnLine (
								context.rep.selEnd [0],
								'specialLine',
								'true'
							);
					}
				};
			};
			lastCallstackType = context.callstack.type;
		}, this);

		this.aceAttribsToClasses = _.bind (function (name, context) {
			// turn attribute into classnames
			if (context.key == 'specialLine') {
				return [context.key + ':' + context.value];
			};
		}, this);

		this.aceDomLineProcessLineAttributes = _.bind (function (name, context) {
			// decorate the line if it has an attribute
			var match = /specialLine:true/i.exec (context.cls);
			if (match) {
				return [{
						preHtml: '<x-whatever style="background-color: #5EEB8A;">',
						postHtml: '</x-whatever>',
						processedMarker: true
						// changing this to false puts
						// a * to the beginning of the
						// actual rendered line, but also
						// stops the caret's weird walking.
					}];
			};
			return [];
		}, this);

	};
}(window.TEMP = window.TEMP || {}));

// Client hooks:

window.exports = window.exports || {}; // fixes a problem that sometimes occure

exports.aceRegisterBlockElements = TEMP.temp.aceRegisterBlockElements;
exports.aceEditEvent = TEMP.temp.aceEditEvent;
exports.aceAttribsToClasses = TEMP.temp.aceAttribsToClasses;
exports.aceDomLineProcessLineAttributes = TEMP.temp.aceDomLineProcessLineAttributes;
exports.aceInitialized = TEMP.temp.aceInitialized;
