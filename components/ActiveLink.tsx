'use client';
import { useRouter } from "next/router";
import React, { CSSProperties } from 'react';
import NextLink from 'next/link';

interface Props {
  text: string;
  href: string;
  className?: string;  // Añadimos aquí la prop className
}

const style: CSSProperties = {
  color: 'red',
  textDecoration:'none',
};

const ActiveLink: React.FC<Props> = ({ text, href, className }) => {
  const router = useRouter();

  // Añade la className al componente Link
  return (
    <NextLink href={href} style={router.pathname === href ? style : undefined} className={className}>
      {text}
    </NextLink>
  );
}

export default ActiveLink;