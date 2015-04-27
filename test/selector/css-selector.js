var assert = require('assert');
var cssSelector = require('../../selector/css-selector');

describe('css selector', function() {
  it('div', function() {
    assert.deepEqual(cssSelector('div'), {
      name: 'div',
      attrs: []
    });
  });

  it('#id', function() {
    assert.deepEqual(cssSelector('div'), {
      name: 'div',
      attrs: []
    });
  });

  it('.class', function() {
    assert.deepEqual(cssSelector('.class'), {
      name: '',
      class: ['class'],
      attrs: []
    });
  });

  it('attribute', function() {
    assert.deepEqual(cssSelector('[key]'), {
      name: '',
      attrs: [{
        name: 'key'
      }]
    });
  });

  it('=attribute', function() {
    assert.deepEqual(cssSelector('[key="value"]'), {
      name: '',
      attrs: [{
        name: 'key',
        operator: '=',
        value: 'value'
      }]
    });
  });

  it('^attribute', function() {
    assert.deepEqual(cssSelector('[key^=value]'), {
      name: '',
      attrs: [{
        name: 'key',
        operator: '^',
        value: 'value'
      }]
    });
  });

  it('$attribute', function() {
    assert.deepEqual(cssSelector('[key$=value]'), {
      name: '',
      attrs: [{
        name: 'key',
        operator: '$',
        value: 'value'
      }]
    });
  });

  it('~attribute', function() {
    assert.deepEqual(cssSelector('[key~=value]'), {
      name: '',
      attrs: [{
        name: 'key',
        operator: '~',
        value: 'value'
      }]
    });
  });

  it('*attribute', function() {
    assert.deepEqual(cssSelector('[key*=value]'), {
      name: '',
      attrs: [{
        name: 'key',
        operator: '*',
        value: 'value'
      }]
    });
  });

  it('mix', function() {
    assert.deepEqual(cssSelector('div#id.cls1.cls2[key^="value value"]'), {
      name: 'div',
      class: ['cls1', 'cls2'],
      attrs: [
        {
          name: 'id',
          operator: '=',
          value: 'id'
        },
        {
          name: 'key',
          value: 'value value',
          operator: '^'
        }
      ]
    });
  });
});