
window.addEventListener('load', () => {
  let location_hash = window.location.hash.replace(/(\|)/g, "\\$1");

  const header = document.querySelector('header') ;

  const alerts = header?.querySelector('.alerts');
  const utilityHeader = header?.querySelector('.utility-header');

  // array of elements that are compacted
  const compactedElements = [
    alerts,
    utilityHeader,
  ].filter(Boolean);

  const getCompactedElementsHeight = () => {
    return compactedElements.reduce((total, element) => {
      if( element instanceof HTMLElement  ){
        // only if the element is visible, we include its height in the total compacted elements height, otherwise we ignore it, since it won't affect the header's position when compacted.
        if( window.getComputedStyle(element).display !== 'none' ){
          return total + element.clientHeight;
        }
      }
  
      return total;
      
    }, 0);
  }

  // get the total height of all elements above the header with a fixed position.
  const getTopOffset = () => {
    let current = header;
    let offset = 0;

    while( current ){
      // if current element has a fixed position, add its height to the topOffset.
      if( current instanceof HTMLElement && window.getComputedStyle(current).position === 'fixed' ){
        offset += current.clientHeight ;
      }
      current = current.previousElementSibling;
    }
    return offset;
  }

  let compactedElementsHeight = getCompactedElementsHeight();
  let topOffset = getTopOffset();

  // resize observer function to watch if compacted elements were resized, 
  // so we can update variables when they change.
  let observedElements = [];

  const clientHeightObserver = (entries) => {
    let hasChanges = false;

    // The callback receives an array of entries, one for each element that resized
    for (let entry of entries) {
      // we check if the entry was already saved once
      if( entry.target.dataset.observer  ){
        let previousEntryIndex = observedElements.findIndex( observedEntry => observedEntry.target.dataset.observer === entry.target.dataset.observer );
        let previousEntry = observedElements[previousEntryIndex];
        
        let previousHeight = previousEntry instanceof ResizeObserverEntry ? previousEntry.contentBoxSize[0].blockSize : previousEntry.target.style.height;
        let currentHeight = entry instanceof ResizeObserverEntry ? entry.contentBoxSize[0].blockSize : entry.target.style.height;

        // if the entry's height has changed, we set hasChanges to true, so we can update the compacted elements height and top offset.
        if( previousHeight !== currentHeight ){
          observedElements[previousEntryIndex] = entry;
          hasChanges = true;
        }

      } else {
        // if not, we save the entry in a data attribute, so we can identify it in future callbacks and avoid unnecessary calculations when an entry changes.
        entry.target.dataset.observer = crypto.randomUUID();

        // save the entry
        observedElements.push(entry);
      }
    }

    // if changes detected, we perform updates
    if (hasChanges) {
      topOffset = getTopOffset();
      compactedElementsHeight = getCompactedElementsHeight();

      updateScrollMarginTop();
      compactHeader()
    }
  }

  // observe compacted elements for height changes, so we can update the compacted elements height when they change.
  compactedElements.forEach((element) => {
    if( element instanceof HTMLElement  ){
      // we add a data-observer attribute to the element, so we can identify it in the callback and avoid unnecessary calculations when an entry changes.
      new ResizeObserver(clientHeightObserver).observe(element);
    }
  });

  let current = header;
  while( current ){
    // if current element has a fixed position add a resize observer
    if( current instanceof HTMLElement && window.getComputedStyle(current).position === 'fixed' ){
      new ResizeObserver(clientHeightObserver).observe(current);
    }
    current = current.previousElementSibling;
  }
    
  // scroll to target
  if( location_hash ){
    // location hash has leading #, so we remove it
    let target = document.getElementById(location_hash.substring(1));

    // if the location hash is not empty, we scroll to the target element
    requestAnimationFrame(() => {
      target?.scrollIntoView({
        behavior: 'smooth'
      });
    });
  }

  if (!header) {
    return;
  }

  // compact header on scroll
  const compactHeader = () => {
    // downscroll code passed the header height
    if (document.body.scrollTop >= header.offsetHeight ||
      document.documentElement.scrollTop >= header.offsetHeight
    ) {
      // move the header up to hide the compacted elements height, minus the top offset.
      header.style.top = `-${(compactedElementsHeight - topOffset)}px`;

    } else {
      // reset header to initial position
      // we need to set the header's top to the offset.
      if( header ){
        header.style.top = `${topOffset}px`;
      }

    }

  };
  
  // for each element with an id we add the scroll-margin-top
  const updateScrollMarginTop = () => {
    // for each element with an id we add the scroll-margin-top
    document.querySelectorAll('#page-container [id]').forEach((element) => {
      if( element instanceof HTMLElement ){ 
        let scrollMarginHeight = header?.clientHeight;
        
        // if the elements offsetTop is greater than twice the header size, 
        // we can assume the header is compacted
        // so we need to subtract the compacted elements height from the scroll margin.
        if( element.offsetTop > scrollMarginHeight + (scrollMarginHeight / 2) ){
          scrollMarginHeight -= compactedElementsHeight;
        }
        element.style.scrollMarginTop = `${scrollMarginHeight + topOffset}px`;
      }
    });
    
  }

  // if there are alerts add a mutation observer to watch for changes in the alerts
  if( alerts ){
    // so we can update the compacted elements height when an alert is closed or 
    // when entering mobile ( class .d-none is added/removed).
    new MutationObserver(clientHeightObserver).observe(alerts, { attributes: true, childList: true });
  }

  // add scroll event listener to compact the header on scroll
  window.addEventListener( 'scroll', compactHeader );
  
  // add scroll margin top to all elements with an id, so that when we scroll to them, they are not hidden behind the header.
  updateScrollMarginTop();

  // compact header on page load in case the page is loaded with a scroll position past the header height.
  compactHeader();
  
  
});
