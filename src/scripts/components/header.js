//@ts-check
window.addEventListener('DOMContentLoaded', () => {
  let location_hash = window.location.hash.replace(/(\|)/g, "\\$1");

  const header = document.querySelector('header') ;
  const pageContainer = document.querySelector('#page-container');

  // array of elements that are compacted
  const compactedElements = [
    document.querySelector('.alerts'),
    document.querySelector('.utility-header'),
  ].filter(Boolean);

  let compactedElementsHeight = compactedElements.reduce((total, element) => {
      if( element instanceof HTMLElement  ){
        return total + element.clientHeight;
      }
  
      return total;
      
    }, 0);

  // lets collect the height of any fixed elements above the header.
  let topOffset = 0;
  let current = header?.previousElementSibling;
  
  while( current ){
      // if current element has a fixed position, add its height to the topOffset.
      if( current instanceof HTMLElement && window.getComputedStyle(current).position === 'fixed' ){
        topOffset += current.clientHeight ;
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

      // if we have a page container, we need to set its top padding to the offset
      if( pageContainer && pageContainer instanceof HTMLElement  ){
        pageContainer.style.paddingTop = `${topOffset}px`;
      }
    
    }

  };
  
  // for each element with an id we add the scroll-margin-top
  document.querySelectorAll('#page-container [id]').forEach((element) => {
    if( element instanceof HTMLElement ){ 
      let scrollMarginHeight = header.clientHeight + topOffset;

      // if the elements offsetTop is greater than twice the header size, 
      // we can assume the header is compacted
      // so we need to subtract the compacted elements height from the scroll margin.
      if( element.offsetTop > scrollMarginHeight + (scrollMarginHeight / 2) ){
        scrollMarginHeight -= compactedElementsHeight;
      }

      element.style.scrollMarginTop = `${scrollMarginHeight}px`;
    }
  });

  // reset position on scroll
  window.addEventListener(
    'scroll', compactHeader
  );

  compactHeader();
  
});
