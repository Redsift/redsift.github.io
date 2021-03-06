(function() {
  // accordion on uses-section of landing page

  // different tabAnchors when window >= 768px
  const selectAnchors = () => {
    let selector = ".tabset li a";
    if (window.innerWidth < 768){
      selector = ".opener";
    } else {
      selector = ".tabset li a";
    }
    return Array.from(document.querySelectorAll(selector));
  };

  let tabAnchors = selectAnchors();
  const tabs = Array.from(document.querySelectorAll(".tab-info"));
  let index = 0;
  let hashIndex = null;

  if (tabAnchors.length !== tabs.length) {
    console.warn("Add the same number of tabs as tab buttons you silly billy!!!");
  }

  const init = () => {
    const tabIds = tabs.map(i => i.id);
    const hash = window.location.hash;
    if (hash && tabIds.includes(hash.substring(1))) {
      // set from location hash
      tabAnchors.find(i => i.hash === hash).classList.add("active"); 
      tabs.find(i => i.id === hash.substring(1)).classList.add("active");
      hashIndex = tabAnchors.findIndex(i => i.hash === hash);
    } else {
      [tabAnchors, tabs].map(i => i[0].classList.add("active"));
    }
  }

  const setActive = (prevIndex, index) => {
    if (hashIndex) {
      tabs[hashIndex].classList.remove("active");
      tabAnchors[hashIndex].classList.remove("active");
    }
    [tabAnchors, tabs].map(i => {
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

  tabAnchors.map((val, idx) => val.onclick = () => selectTab(idx));
  
  window.addEventListener('resize', () => {
    tabAnchors.map(i => i.removeEventListener("onclick", selectTab, false));
    tabAnchors = selectAnchors();
    tabAnchors.map((val, idx) => val.onclick = () => selectTab(idx));
  })

})();
  