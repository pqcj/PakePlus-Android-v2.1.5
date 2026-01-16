window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});const { invoke } = window.__TAURI__.core

function shouldOpenExternal(url) {
  try {
    const u = new URL(url)
    const host = u.hostname.toLowerCase()
    const domains = ['bilibili.com', 'b23.tv']
    return domains.some(d => host === d || host.endsWith('.' + d))
  } catch (e) {
    return false
  }
}

// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
  const origin = e.target.closest('a')
  const isBaseTargetBlank = document.querySelector('head base[target="_blank"]')
  console.log('origin', origin, isBaseTargetBlank)

  if (!origin || !origin.href) return

  // NEW: bilibili -> open in default browser
  if (shouldOpenExternal(origin.href)) {
    e.preventDefault()
    e.stopPropagation()
    console.log('open external', origin.href)
    invoke('open_url', { url: origin.href })
    return
  }

  // original logic: _blank -> open inside webview
  if (origin.target === '_blank' || isBaseTargetBlank) {
    e.preventDefault()
    console.log('handle origin', origin)
    location.href = origin.href
  } else {
    console.log('not handle origin', origin)
  }
}

window.open = function (url, target, features) {
  console.log('open', url, target, features)

  // NEW: bilibili -> open in default browser
  if (shouldOpenExternal(url)) {
    invoke('open_url', { url })
    return null
  }

  // original logic
  location.href = url
  return null
}

document.addEventListener('click', hookClick, { capture: true })