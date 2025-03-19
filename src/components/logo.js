"use client";

import Image from "next/image";

const Logo = () => {
    return (
        <>
            <Image src="/logo.svg" alt="Logo" width={50} height={50} />
        </>
    );
};

export default Logo;
