import NoteEditor from '../../components/NoteEditor';
import { useAuth } from '../../utils/useAuth';
import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const EditBook = () => {
  // What if id is invalid and doesn't match any book note?
  const router = useRouter();
  const id: string = router.query.id as string;
  const { authState } = useAuth();
  const { useStatusState } = authState;

  if (useStatusState.status === 'loading') {
    return 'Loading ...';
  } else if (useStatusState.status === 'error') {
    return (
      <Text align={'center'} color={'red.400'} fontWeight={'bold'}>
        Error {useStatusState.error.code}
      </Text>
    );
  } else if (useStatusState.status === 'loaded') {
    return <NoteEditor docId={id} />;
  }
};

export default EditBook;
