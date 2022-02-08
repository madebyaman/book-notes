import { signInWithEmailAndPassword } from '@firebase/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../firebase';
import cookie from 'cookie';

type BodyCredentials = { email: string; password: string; remember?: Boolean };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, password, remember } = req.body as BodyCredentials;
    const user = await signInWithEmailAndPassword(auth, email, password);
    const token = await user.user.getIdToken();
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('ACCESS_TOKEN', token, {
        httpOnly: true,
        maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60 * 24,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    );
    return res.json(user.user);
  } catch (err) {
    res.status(401);
    res.json({ message: 'Email or password is incorrect' });
  }
};

export default handler;
