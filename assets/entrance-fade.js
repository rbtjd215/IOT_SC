(() => {
  'use strict';
  const addFade=(node,delay)=>{
    node.classList.add('entry-fade');
    node.style.setProperty('--fade-delay',delay+'s');
  };
  document.querySelectorAll('#deck>.slide').forEach(slide=>{
    const content=slide.querySelector('.content');
    if(!content)return;
    [...content.children].forEach((node,index)=>{
      if(node.matches('.assembly-node,.sequence-node') || node.querySelector('.assembly-node,.sequence-node'))return;
      // Page 8 already coordinates this caption with the arriving branches.
      if(slide.dataset.slide==='8' && node.classList.contains('tree-caption'))return;
      addFade(node,Math.min(.22+index*.07,.40).toFixed(2));
    });
    if(slide.dataset.slide==='8'){
      const orderHeading=slide.querySelector('.execution>h3');
      if(orderHeading)addFade(orderHeading,.28);
    }
    slide.dataset.fadeReady='true';
  });
})();
