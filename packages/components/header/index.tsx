{
    /* eslint-disable @next/next/no-img-element */
}

import React from 'react'
import Link from 'next/link'
import HeaderComponent from './header-component'
import { HeaderProps } from './header-component/header-props'

export default function Header() {
    let header: HeaderProps | null = null

    // try {
    //     header = await fetchHeader()
    // } catch (error) {
    //     console.log(error)
    // }
    return (
        <>
            <HeaderComponent />
        </>
    )
}
