import Link from 'next/link';
import { Link as ChakraLink } from '@chakra-ui/react';
import { ReactNode } from 'react';

type ChakraNextLinkProps = {
  href: string;
  children?: ReactNode;
  [x: string]: any;
};

function ChakraNextLinkButton({
  href,
  children,
  ...props
}: ChakraNextLinkProps) {
  return (
    <Link href={href} passHref>
      <ChakraLink {...props}>{children}</ChakraLink>
    </Link>
  );
}

export default ChakraNextLinkButton;
