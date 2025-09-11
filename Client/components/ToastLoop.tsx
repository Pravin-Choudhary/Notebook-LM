'use client'

import { BadgeCheck, Globe, RefreshCcw, Rocket } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

const SonnerMsgs = () => {
  const indexRef = useRef(0) // keep track of which toast to show

  useEffect(() => {
    const toasts = [
      {
        msg: 'Processing website content… this may take a few minutes.',
        style: {
          '--normal-bg':
            'color-mix(in oklab, light-dark(var(--color-sky-600), var(--color-sky-400)) 10%, var(--background))',
          '--normal-text': 'light-dark(var(--color-sky-600), var(--color-sky-400))',
          '--normal-border': 'light-dark(var(--color-sky-600), var(--color-sky-400))'
        },
        icon: <RefreshCcw className='size-5 shrink-0 animate-spin' />
      },
      {
        msg: 'Fetching data from the website, please wait…',
        style: {
          '--normal-bg':
            'color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))',
          '--normal-text': 'light-dark(var(--color-amber-600), var(--color-amber-400))',
          '--normal-border': 'light-dark(var(--color-amber-600), var(--color-amber-400))'
        },
        icon: <Globe className='size-5 shrink-0' />
      },
      {
        msg: 'Crunching text into embeddings, hang tight!',
        style: {
          '--normal-bg':
            'color-mix(in oklab, light-dark(var(--color-sky-600), var(--color-sky-400)) 10%, var(--background))',
          '--normal-text': 'light-dark(var(--color-sky-600), var(--color-sky-400))',
          '--normal-border': 'light-dark(var(--color-sky-600), var(--color-sky-400))'
        },
        icon: <Rocket className='size-5 shrink-0' />
      },
      {
        msg: 'AI is analyzing the site… almost there!',
        style: {
          '--normal-bg':
            'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
          '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
          '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))'
        },
        icon: <BadgeCheck className='size-5 shrink-0' />
      }
    ]

    const interval = setInterval(() => {
      const t = toasts[indexRef.current]

      toast(
        <div className='flex items-center gap-2'>
          {t.icon}
          {t.msg}
        </div>,
        { style: t.style as React.CSSProperties }
      )

      // move to next toast, loop back when reaching the end
      indexRef.current = (indexRef.current + 1) % toasts.length
    }, 3000) 

    return () => clearInterval(interval) 
  }, [])

  return null
}

export default SonnerMsgs
