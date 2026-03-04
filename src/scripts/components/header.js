
window.addEventListener('load', () => {
  let location_hash = window.location.hash.replace(/(\|)/g, "\\$1");

  const header = document.querySelector('header') ;
  const pageContainer = document.querySelector('#page-container');

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
        return total + element.clientHeight;
      }
  
      return total;
      
    }, 0);
  }

  let compactedElementsHeight = getCompactedElementsHeight();

  // resize observer function to watch if compacted elements change height, so we can update the compacted elements height when they change.
  const clientHeightObserver = (entries) => {
    for(const entry of entries) {
      // update the compacted elements height when the compacted entry changes., which can happen when google translate loads and changes the height of the utility header or when items wrap
      compactedElementsHeight = getCompactedElementsHeight();
    }
  }

  // observe compacted elements for height changes, so we can update the compacted elements height when they change.
  compactedElements.forEach((element) => {
    if( element instanceof HTMLElement  ){
      const observer = new ResizeObserver(clientHeightObserver);
      observer.observe(element);
    }
  });

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

  const compactHeader = () => {
    // downscroll code passed the header height
    if (document.body.scrollTop >= header.offsetHeight ||
      document.documentElement.scrollTop >= header.offsetHeight
    ) {
      // move the header up to hide the compacted elements height, minus the top offset.
      header.style.top = `-${(compactedElementsHeight)}px`;

    } else {
      // reset header to initial position
      // we need to set the header's top to the offset.
      if( header ){
        header.style.top = 0;
      }

    }

  };
  
  // we need to update the compacted elements height if an alert is closed, so we listen for the alert close event and update the compacted elements height.
  document.querySelectorAll('header .alerts [data-bs-dismiss="alert"]').forEach((closeButton) => {
    closeButton.addEventListener('click', () => {
      compactedElementsHeight = getCompactedElementsHeight();
      document.querySelectorAll('#page-container [id]').forEach(updateScrollMarginTop);
    });
  });

  // for each element with an id we add the scroll-margin-top
  const updateScrollMarginTop = (/** @type Element */ element) => {
    
    if( element instanceof HTMLElement ){ 
          // if the elements offsetTop is greater than twice the header size, 
          // we can assume the header is compacted
          // so we need to subtract the compacted elements height from the scroll margin.
          if( element.offsetTop > scrollMarginHeight + (scrollMarginHeight / 2) ){
            scrollMarginHeight -= compactedElementsHeight;
          }
  
          element.style.scrollMarginTop = `${scrollMarginHeight}px`;
        }
  }

  // add scroll margin top to all elements with an id, so that when we scroll to them, they are not hidden behind the header.
  document.querySelectorAll('#page-container [id]').forEach(updateScrollMarginTop);

  // reset position on scroll
  window.addEventListener(
    'scroll', compactHeader
  );

  compactHeader();
  
});
