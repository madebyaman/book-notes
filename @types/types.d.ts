export type SignupProps = {
  name?: string;
  email: string;
  password: string;
};

export type SigninProps = {
  email: string;
  password: string;
};

export type Signup = ({ name, email, password }: SignupProps) => Promise<void>;

export type Signin = ({ email, password }: SigninProps) => Promise<void>;