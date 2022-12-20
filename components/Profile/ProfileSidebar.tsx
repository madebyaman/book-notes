import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import { ImUser } from 'react-icons/im';

import { UserProfile } from '@/@types';
import { Nav } from '../nav';

interface ProfileSidebarPropsInterface {
  profile: Omit<UserProfile, 'id' | 'email'>;
}

export const ProfileSidebar = ({ profile }: ProfileSidebarPropsInterface) => {
  const {
    name,
    username,
    bio,
    youtubeUrl,
    twitterUrl,
    facebookUrl,
    instagramUrl,
    linkedInUrl,
    photo,
  } = profile;

  return (
    <>
      <Box as="header">
        <Nav />
      </Box>
      <Box mt="12">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            width="75px"
            height="75px"
            rounded="full"
          />
        ) : (
          <ImUser fontSize="50px" />
        )}
        <Heading as="h1" fontSize={'40px'} color="text.400" my={1}>
          Book notes: {name}
        </Heading>
        <Text color="gray.400" fontSize="21px" fontWeight="semibold" mb="1">
          @{username}
        </Text>
        {bio && <Text>{bio}</Text>}
        <Flex alignItems={'center'} gap="2">
          {youtubeUrl && <FaYoutube />}
          {twitterUrl && <FaTwitter />}
          {instagramUrl && <FaInstagram />}
          {linkedInUrl && <FaLinkedin />}
          {facebookUrl && <FaFacebook />}
        </Flex>
      </Box>
    </>
  );
};
