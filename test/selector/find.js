var fs = require('fs');
var path = require('path');
var HtmlDom = require('../../htmldom');
var assert = require('assert');

describe('found', function() {
  var html = new HtmlDom('<div><h3><a class="link"></a></h3></div><div><h3>1</h3></div>');
  var $ = html.$;
  var div = $('div');

  it('tag', function() {
    assert.equal(div.find('h3').length, 2);
    assert.equal(div.find('h3').html(), '<a class="link"></a>');
    assert.equal(div.find('a').length, 1);
  });

  it('class', function() {
    assert.equal(div.find('.link').length, 1);
    div.find('h3').html('').addClass('title');
    assert.equal(html.html(), '<div><h3 class="title"></h3></div><div><h3 class="title"></h3></div>');
  });
});