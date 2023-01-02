import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  VisuallyHidden,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Nav } from '@/components/nav';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

const Home: NextPage = function () {
  const router = useRouter();

  return (
    <div>
      <Container maxW="container.lg" mt="8">
        <Nav />
        <Grid
          templateColumns={'1fr'}
          alignItems={'center'}
          gap="12"
          flexDirection={{ base: 'column', md: 'row' }}
          mt="20"
        >
          <Box textAlign={'center'}>
            <Heading as="h1" fontSize={'54px'} color="text.400">
              Write, publish, and share your book notes with ease
            </Heading>
            <Text fontSize={'22px'} color="gray.500" my="8">
              Boomaries is a powerful app to help your write your book notes and
              share them with other people.
            </Text>
            <Button
              textTransform={'uppercase'}
              rounded="md"
              px="8"
              py="6"
              backgroundColor={'primary.700'}
              fontWeight="bold"
              color="white"
              _hover={{
                backgroundColor: 'primary.400',
              }}
              // color="white"
              onClick={() => router.push('/signin')}
            >
              Start writing book notes
            </Button>
          </Box>
          <Box margin="0 auto">
            <Link
              href="https://www.loom.com/share/8773464442644aabb53ea64300be5d27"
              target={'_blank'}
              title={'Watch app demo'}
            >
              <VisuallyHidden>
                Bummaries App - 2 January 2023 - Watch Video
              </VisuallyHidden>
              <Image
                width={600}
                height={400}
                src="https://cdn.loom.com/sessions/thumbnails/8773464442644aabb53ea64300be5d27-with-play.gif"
                alt={'watch screencast'}
              />
            </Link>
            {/* <Image
              src="/screenshot.png"
              width={2760 / 2}
              height={1720 / 2}
              alt={'App screenshot'}
            /> */}
          </Box>
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
