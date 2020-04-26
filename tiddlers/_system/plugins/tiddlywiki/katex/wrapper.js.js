/*\
title: $:/plugins/tiddlywiki/katex/wrapper.js
type: application/javascript
module-type: widget

Wrapper for `katex.min.js` that provides a `<$latex>` widget. It is also available under the alias `<$katex>`

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var katex = require("$:/plugins/tiddlywiki/katex/katex.min.js"),
    chemParse = require("$:/plugins/tiddlywiki/katex/mhchem.min.js"),
	Widget = require("$:/core/modules/widgets/widget.js").widget;
// Add \ce, \pu, and \tripledash to the KaTeX macros.
katex.__defineMacro("\\ce", function(context) {
  return chemParse(context.consumeArgs(1)[0], "ce")
});
katex.__defineMacro("\\pu", function(context) {
  return chemParse(context.consumeArgs(1)[0], "pu");
});
//  Needed for \bond for the ~ forms
//  Raise by 2.56mu, not 2mu. We're raising a hyphen-minus, U+002D, not 
//  a mathematical minus, U+2212. So we need that extra 0.56.
katex.__defineMacro("\\tripledash", "{\\vphantom{-}\\raisebox{2.56mu}{$\\mkern2mu"
+ "\\tiny\\text{-}\\mkern1mu\\text{-}\\mkern1mu\\text{-}\\mkern2mu$}}");

var KaTeXWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
KaTeXWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
KaTeXWidget.prototype.render = function(parent,nextSibling) {
	// Housekeeping
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	// Get the source text
	var text = this.getAttribute("text",this.parseTreeNode.text || "");
	var displayMode = this.getAttribute("displayMode",this.parseTreeNode.displayMode || "false") === "true";
	// Render it into a span
	var span = this.document.createElement("span"),
		options = {throwOnError: false, displayMode: displayMode, macros: customMacros};
	try {
		if(!this.document.isTiddlyWikiFakeDom) {
			katex.render(text,span,options);
		} else {
			span.innerHTML = katex.renderToString(text,options);
		}
	} catch(ex) {
		span.className = "tc-error";
		span.textContent = ex;
	}
	// Insert it into the DOM
	parent.insertBefore(span,nextSibling);
	this.domNodes.push(span);
};

/*
Compute the internal state of the widget
*/
KaTeXWidget.prototype.execute = function() {
	// Nothing to do for a katex widget
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
KaTeXWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.text) {
		this.refreshSelf();
		return true;
	} else {
		return false;	
	}
};

exports.latex = KaTeXWidget;
exports.katex = KaTeXWidget;

})();

var customMacros = {
    "\\RP":         "\\R\\mathrm{P}",
    "\\C":          "\\mathbb{C}",
    "\\P":          "\\mathbb{P}",
    "\\D":          "\\mathrm{D}",
    "\\d":          "\\mathrm{d}",
    "\\i":          "\\mathrm{i}",
    "\\T":          "\\mathrm{T}",
    "\\G":          "\\mathrm{G}",
    "\\L":          "\\mathrm{L}",
    "\\O":          "\\operatorname{O}",
    "\\SO":         "\\operatorname{SO}",
    "\\U":          "\\operatorname{U}",
    "\\GL":         "\\operatorname{GL}",
    "\\PO":         "\\operatorname{PO}",
    "\\PGL":        "\\operatorname{PGL}",
    "\\Sym":        "\\operatorname{Sym}",
    "\\Aut":        "\\operatorname{Aut}",
    "\\crossratio": "\\operatorname{cr}",
    "\\rank":       "\\operatorname{rank}",
    "\\Rang":       "\\operatorname{Rang}",
    "\\Eig":        "\\operatorname{Eig}",
    "\\sign":       "\\operatorname{sign}",
    "\\supp":       "\\operatorname{supp}",
    "\\id":         "\\operatorname{id}",
    "\\vol":        "\\operatorname{vol}",
    "\\operp":      "\\mathbin{\\perp\\kern-21mu{\\bigcirc}}",
    "\\sd":         "\\mathbin\\triangle",
    "\\eps":        "\\operatorname{eps}",
    "\\gl":         "\\operatorname{gl}",
    "\\rd":         "\\operatorname{rd}",
    "\\tr":         "\\operatorname{tr}",
    "\\Ric":        "\\operatorname{Ric}",
    "\\grad":       "\\operatorname{grad}"
};