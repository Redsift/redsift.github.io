'use strict';

{{ $searchDataFile := printf "%s.search-data.js" .Language.Lang }}
{{ $searchData := resources.Get "search-data.js" | resources.ExecuteAsTemplate $searchDataFile . | resources.Minify | resources.Fingerprint }}

(function() {
  const input = document.querySelector('#search-input');
  const results = document.querySelector('#search-results');
  const mainMenu = document.querySelector('.sidebar .nav-holder > ul');

  input.addEventListener('focus', init);
  input.addEventListener('blur', restore);
  input.addEventListener('keyup', search);

  document.addEventListener('keypress', focusSearchFieldOnKeyPress);

  function focusSearchFieldOnKeyPress(e) {
    if (input === document.activeElement) {
      return;
    }

    const characterPressed = String.fromCharCode(e.charCode);
    if (!isHotkey(characterPressed)) {
      return;
    }

    input.focus();
    e.preventDefault();
  }

  function isHotkey(character) {
    const dataHotkeys = input.getAttribute('data-hotkeys') || '';
    return dataHotkeys.indexOf(character) >= 0;
  }

  function init() {
    input.removeEventListener('focus', init); // init once
    input.required = true;

    loadScript('{{ "flexsearch.min.js" | relURL }}');
    loadScript('{{ $searchData.RelPermalink }}', function() {
      input.required = false;
      search();
    });
  }

  function search() {
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }

    if (!input.value) {
      return;
    }

    const searchHits = window.bookSearchIndex.search(input.value, 10);
    searchHits.forEach(function(page) {
      const li = document.createElement('li'),
            a = li.appendChild(document.createElement('a'));

      a.href = page.href;
      a.textContent = page.title;

      results.appendChild(li);
    });
    
    if (searchHits.length && input.value.length) {
      mainMenu.classList.add('hide');
    } else {
      const noResults = document.createElement('li');
      noResults.textContent = 'No results found';
      noResults.classList.add('no-results');
      results.appendChild(noResults);
    }
  }

  function restore() {
    // if there are search no results, and nothing in the search bar,
    // - we show the regular menu and remove no results message
    const searchHits = window.bookSearchIndex.search(input.value, 10);
    if (!searchHits.length && !input.value.length) {
      mainMenu.classList.remove('hide');
      while (results.firstChild) {
        results.removeChild(results.firstChild);
      }
    }
  }

  function loadScript(src, callback) {
    const script = document.createElement('script');
    script.defer = true;
    script.async = false;
    script.src = src;
    script.onload = callback;

    document.head.appendChild(script);
  }
})();
