(function(){
  'use strict';

  // 현재 연도 표시
  var yearEl=document.getElementById('year');
  if(yearEl){ yearEl.textContent=String(new Date().getFullYear()); }

  // 스크롤 진행 막대 업데이트
  var progressBar=document.getElementById('scrollProgressBar');
  function updateProgress(){
    if(!progressBar) return;
    var scrollTop=window.scrollY||document.documentElement.scrollTop;
    var docHeight=document.documentElement.scrollHeight - window.innerHeight;
    var ratio=docHeight>0 ? (scrollTop/docHeight) : 0;
    progressBar.style.width=(ratio*100)+'%';
  }
  window.addEventListener('scroll',updateProgress,{passive:true});
  window.addEventListener('resize',updateProgress);

  // 인터섹션 옵저버: 스크롤 진입 시 reveal
  var revealEls=[].slice.call(document.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },{threshold:0.15});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('visible'); });
  }

  // 부드러운 스크롤: 네비게이션 링크
  var navLinks=[].slice.call(document.querySelectorAll('.nav-link'));
  navLinks.forEach(function(a){
    a.addEventListener('click',function(e){
      var href=a.getAttribute('href');
      if(href && href.startsWith('#')){
        var target=document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth',block:'start'});
        }
      }
    });
  });

  // 섹션 인뷰 시 네비게이션 하이라이트
  var sectionIds=['#hero','#education','#projects','#statement'];
  var sections=sectionIds.map(function(id){ return document.querySelector(id); }).filter(Boolean);
  var linkById={};
  navLinks.forEach(function(l){ linkById[l.getAttribute('href')]=l; });
  if('IntersectionObserver' in window){
    var sectionObserver=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var id='#'+entry.target.id;
        var link=linkById[id];
        if(!link) return;
        if(entry.isIntersecting){
          navLinks.forEach(function(n){ n.classList.remove('active'); });
          link.classList.add('active');
        }
      });
    },{root:null,threshold:0.6});
    sections.forEach(function(s){ sectionObserver.observe(s); });
  }

  // Hero 키워드 버튼: 전역 필터 동기화
  var tagButtons=[].slice.call(document.querySelectorAll('.tag-btn'));
  var projectCards=[].slice.call(document.querySelectorAll('.project-card'));
  var visibleCountEl=document.getElementById('visibleCount');
  function setVisibleCount(){
    if(!visibleCountEl) return;
    var count=projectCards.filter(function(card){ return card.style.display!== 'none'; }).length;
    visibleCountEl.textContent=String(count);
  }

  function filterByTag(tag){
    if(tag==='all'){
      projectCards.forEach(function(card){ card.style.display=''; });
      setVisibleCount();
      return;
    }
    projectCards.forEach(function(card){
      var tags=(card.getAttribute('data-tags')||'').split(',').map(function(s){return s.trim();});
      card.style.display=tags.indexOf(tag) !== -1 ? '' : 'none';
    });
    setVisibleCount();
  }

  function resetTagButtonPressed(targetTag){
    tagButtons.forEach(function(btn){
      var pressed=btn.getAttribute('data-tag')===targetTag;
      btn.setAttribute('aria-pressed',String(pressed));
      btn.classList.toggle('active',pressed);
    });
  }

  tagButtons.forEach(function(btn){
    btn.addEventListener('click',function(){
      var tag=btn.getAttribute('data-tag');
      if(!tag) return;
      resetTagButtonPressed(tag);
      filterByTag(tag);
      // 모바일 셀렉트 동기화
      var sel=document.getElementById('filterSelect');
      if(sel){ sel.value=tag; }
    });
  });

  // 사이드바 필터 버튼 + 모바일 셀렉트
  var filterBtns=[].slice.call(document.querySelectorAll('.filter-btn'));
  function activateFilterButtons(tag){
    filterBtns.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-tag')===tag); });
  }

  filterBtns.forEach(function(b){
    b.addEventListener('click',function(){
      var tag=b.getAttribute('data-tag');
      activateFilterButtons(tag);
      resetTagButtonPressed(tag);
      filterByTag(tag);
      var sel=document.getElementById('filterSelect');
      if(sel){ sel.value=tag; }
    });
  });

  var filterSelect=document.getElementById('filterSelect');
  if(filterSelect){
    filterSelect.addEventListener('change',function(){
      var tag=filterSelect.value;
      activateFilterButtons(tag);
      resetTagButtonPressed(tag);
      filterByTag(tag);
    });
  }

  // 아코디언: 프로젝트 상세 토글
  var toggles=[].slice.call(document.querySelectorAll('.accordion-toggle'));
  toggles.forEach(function(toggle){
    toggle.addEventListener('click',function(){
      var controls=toggle.getAttribute('aria-controls');
      if(!controls) return;
      var content=document.getElementById(controls);
      var expanded=toggle.getAttribute('aria-expanded')==='true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      if(content){ content.hidden=expanded; }
    });
  });

  // 탭: 페이드 전환 및 a11y
  function initTabs(container){
    var tabs=[].slice.call(container.querySelectorAll('[role="tab"]'));
    var panels=[].slice.call(container.parentElement.querySelectorAll('[role="tabpanel"]'));

    function selectTab(next){
      tabs.forEach(function(t){ t.setAttribute('aria-selected','false'); });
      next.setAttribute('aria-selected','true');

      var targetId=next.getAttribute('aria-controls');
      panels.forEach(function(p){
        var isTarget=p.id===targetId;
        p.hidden=!isTarget;
        p.classList.toggle('in', isTarget);
      });
    }

    tabs.forEach(function(tab,idx){
      tab.addEventListener('click',function(){ selectTab(tab); });
      tab.addEventListener('keydown',function(e){
        var key=e.key;
        if(key==='ArrowRight' || key==='ArrowLeft'){
          e.preventDefault();
          var delta= key==='ArrowRight' ? 1 : -1;
          var nextIndex=(idx+delta+tabs.length)%tabs.length;
          selectTab(tabs[nextIndex]);
          tabs[nextIndex].focus();
        }
        if(key==='Home'){ e.preventDefault(); selectTab(tabs[0]); tabs[0].focus(); }
        if(key==='End'){ e.preventDefault(); selectTab(tabs[tabs.length-1]); tabs[tabs.length-1].focus(); }
      });
    });
  }

  var tabLists=[].slice.call(document.querySelectorAll('.tabs'));
  tabLists.forEach(initTabs);

  // 초기 상태 카운트 세팅
  setVisibleCount();

  // to-top 버튼
  var toTop=document.getElementById('toTop');
  function onScroll(){
    if(!toTop) return;
    var y=window.scrollY||document.documentElement.scrollTop;
    var show=y>300;
    toTop.hidden=!show;
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  if(toTop){
    toTop.addEventListener('click',function(){ window.scrollTo({top:0,behavior:'smooth'}); });
  }

  // 초기 호출
  updateProgress();
  onScroll();
})();



