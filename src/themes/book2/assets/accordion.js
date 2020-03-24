(function() {
  // accordion on uses-section of landing page

  const tabButtons = document.querySelectorAll(".tabset li a");
  const tabs = document.querySelectorAll(".tab-info");

  let index = 0;
  let hashIndex = null;

  if (tabButtons.length !== tabs.length) {
    console.warn("Add the same number of tabs as tab buttons you silly billy!!!");
  }

  const init = () => {
    const tabIds = Array.from(tabs).map(i => i.id);
    const hash = window.location.hash;
    if (hash && tabIds.includes(hash.substring(1))) {
      // set from location hash
      Array.from(tabButtons).find(i => i.hash === hash).classList.add("active"); 
      Array.from(tabs).find(i => i.id === hash.substring(1)).classList.add("active");
      hashIndex = Array.from(tabButtons).findIndex(i => i.hash === hash);
    } else {
      [tabButtons, tabs].map(i => i[0].classList.add("active"));
    }
  }

  const setActive = (prevIndex, index) => {
    if (hashIndex) {
      tabs[hashIndex].classList.remove("active");
      tabButtons[hashIndex].classList.remove("active");
    }
    [tabButtons, tabs].map(i => {
      i[prevIndex].classList.remove("active");
      i[index].classList.add("active");
    });
  }

  const selectTab = btnIdx => {
    const prevIndex = index;
    if ((prevIndex || hashIndex) !== btnIdx) {
      index = btnIdx;
      setActive(prevIndex, index);
    }
  }

  init();

  Array.from(tabButtons).map((val, idx) => val.onclick = () => selectTab(idx));

})();
  