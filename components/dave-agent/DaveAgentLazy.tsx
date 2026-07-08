'use client'

import dynamic from 'next/dynamic'

const DaveAgentLazy = dynamic(() => import('./DaveAgent'), { ssr: false })

export default DaveAgentLazy
