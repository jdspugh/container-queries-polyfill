const gVarNameW = `--container-width`
const gVarNameH = `--container-height`

/**
 * @param {string} e
 * @returns {NodeListOf<HTMLElement>}
 */
const $$=e=>document.querySelectorAll(e)

function init() {
  if (CSS.supports('container-type','size')) return// polyfill not needed

  // setup resize observers refreshing container-type element css vars
  $$('[style*="container-type"]').forEach(el=>
    new ResizeObserver(entries=>{
      for(let e of entries) {
        const t = /**@type {HTMLElement}*/(e.target)
        /**@type {DOMRectReadOnly}*/const r = e.contentRect

        t.style.setProperty(gVarNameW,r.width+'px')
        t.style.setProperty(gVarNameH,r.height+'px')
      }
    }).observe(el)
  )

  // replace all stylesheet cqw/cqh with calc
  $$('style').forEach(s=>s.innerHTML=cqsToCalcs(s.innerHTML))

  // replace all inline cqw/cqh with calc
  $$('[style*="cqw"],[style*="cqh"]').forEach(cqEl=>cqEl.setAttribute('style',cqsToCalcs(cqEl.getAttribute('style')||'')))
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded', init):init()

/**
 * @param {string} s 
 * @returns {string}
 */
function cqsToCalcs(s) {
  return s.replace(/([\d|.]+)cqw/g,`calc($1*var(${gVarNameW})/100)`)
          .replace(/([\d|.]+)cqh/g,`calc($1*var(${gVarNameH})/100)`)
}
