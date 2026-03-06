
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

  // compact header on scroll
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
        element.style.scrollMarginTop = `${scrollMarginHeight}px`;
      }
    });
    
  }

  // if there are alerts add a mutation observer to watch for changes in the alerts container, 
  if( alerts ){
    // so we can update the compacted elements height when an alert is closed or a new alert is added.
    new MutationObserver((mutationList, observer) => {
      compactedElementsHeight = getCompactedElementsHeight();
      updateScrollMarginTop();
    }).observe(alerts, { attributes: true, childList: true });
  }

  // add scroll event listener to compact the header on scroll
  window.addEventListener( 'scroll', compactHeader );
  
  // add scroll margin top to all elements with an id, so that when we scroll to them, they are not hidden behind the header.
  updateScrollMarginTop();

  // compact header on page load in case the page is loaded with a scroll position past the header height.
  compactHeader();
  
  
});
