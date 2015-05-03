var css = require('./css');

function _private(fn) {
  for (var i in _private) {
    Object.defineProperty(fn, i, {
      enumerable: false,
      writable: false,
      value: _private[i]
    });
  }
}

_private.oneByOne = function(selector) {
  var result = this.search(selector.shift());

  while (selector.length) {
    var item = selector.shift();

    switch (item.operator) {
      case '>':
        result = this.matchDirectParent(item, result);
        break;
      case '+':
        result = this.matchNextWithBrother(item, result);
        break;
      case '~':
        result = this.matchPrecededByBrother(item, result);
        break;
      default:
        result = this.matchParent(item, result);
    }
  }

  return result;
};

// find all child first
_private.search = function(selector) {
  var result = [];
  function recurse(item) {
    if (item.type !== 'tag') return;
    if (css.match(item, selector)) {
      result.push(item);
    }

    for (var i = 0, l = item.children.length; i < l; i++) {
      recurse(item.children[i]);
    }
  }

  for (var i = 0, l = this.document.length; i < l; i++) {
    recurse(this.document[i]);
  }

  return result;
};

/**
 * @example
 * $('div a')
 */
_private.matchParent = function(selector, nodes) {
  var result = [];

  for (var i = 0, l = nodes.length; i < l; i++) {
    var searchNode = nodes[i]._searchNode || nodes[i];
    var match = false; 
    while (searchNode = searchNode.parent) {
      if (css.match(searchNode, selector)) {
        result.push(nodes[i]);
        nodes[i]._searchNode = searchNode;
        match = true;
        break;
      }
    }

    if (!match) {
      delete nodes[i]._searchNode;
    }
  }

  return result;
};

/**
 * @example
 * $('div > a')
 */
_private.matchDirectParent = function(selector, nodes) {
  var result = [];

  for (var i = 0, l = nodes.length; i < l; i++) {
    var searchNode = nodes[i]._searchNode || nodes[i];
    searchNode = searchNode.parent;

    if (searchNode && css.match(searchNode, selector)) {
      result.push(nodes[i]);
      nodes[i]._searchNode = searchNode;
    } else {
      delete nodes[i]._searchNode;
    }
  }

  return result;
};

/**
 * @example
 * $('div + p')
 */
_private.matchNextWithBrother = function(selector, nodes) {
  var result = [];

  function preceded(brother, node) {
    for (var i = 0; i < brother.length; i++) {
      if (brother[i] === node) {
        break;
      }
    }

    while (i--) {
      var item = brother[i];

      if (item.type === 'tag') {
        return item;
      }
    }
  }

  for (var i = 0, l = nodes.length; i < l; i++) {
    var searchNode = nodes[i]._searchNode || nodes[i];
    var brother;
    if (searchNode.parent) {
      brother = searchNode.parent.children;
    } else {
      brother = this.document;
    }
    var pre = preceded(brother, searchNode);

    if (pre && css.match(pre, selector)) {
      result.push(nodes[i]);
      nodes[i]._searchNode = pre;
    } else {
      delete nodes[i]._searchNode;
    }
  }

  return result;
};
/**
 * @example 
 * $('div ~ p')
 */
_private.matchPrecededByBrother = function(selector, nodes) {
  var result = [];

  function preceded(brother, node) {
    for (var i = 0; i < brother.length; i++) {
      if (brother[i] === node) {
        break;
      }
    }
    
    return brother.slice(0, i);
  }

  for (var i = 0, l = nodes.length; i < l; i++) {
    var searchNode = nodes[i]._searchNode || nodes[i];
    var brother;
    if (searchNode.parent) {
      brother = searchNode.parent.children;
    } else {
      brother = this.document;
    }

    var pres = preceded(brother, searchNode);

    if (pres.length) {
      for (var j = 0; j < pres.length; j++) {
        if (css.match(pres[j], selector)) {
          result.push(nodes[i]);
          nodes[i]._searchNode = pres[i];
          break;
        }
      }
    } else {
      delete nodes[i]._searchNode;
    }
  }

  return result;
};

// for find api
_private.newContext = function(dom) {
  var root = [];
  var result = [];

  for (i = 0; i < this.length; i++) {
    var isChild = false;
    parent = this[i].parent;
    while (parent) {
      if (root.indexOf(parent) !== -1) {
        isChild = true;
        break;
      }
      parent = parent.parent;
    }

    if (!isChild) {
      root.push(this[i]);
    }
  }

  result = root.reduce(function(pre, current,index) {
    var children = current.children;
    var result = [];

    for (var i = 0; i < children.length; i++) {
      if (children[i].type === 'tag') {
        children[i]._parent = children[i].parent;
        children[i].parent = null;
        result.push(children[i]);
      }
    }

    return pre.concat(current.children);
  }, result);

  return result;
};

_private.resetContext = function(ctx) {
  for (var i = 0; i < ctx.length; i++) {
    var item = ctx[i];
    item.parent = item._parent;
    delete item._parent;
  }
};

_private.createdom = function(html, callback) {
  var HtmlDom = require('../htmldom');

  for (var i = 0; i < this.length; i++) {
    var htmldom = new HtmlDom(html).dom;
    callback(this[i], htmldom);
  }
};

module.exports = _private;