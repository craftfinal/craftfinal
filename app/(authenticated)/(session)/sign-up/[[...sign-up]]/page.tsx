import { getCurrentAccountOrNull } from "@/actions/user";
import WelcomeMessage from "@/app/(authenticated)/(session)/WelcomeMessage";
import { SignUp, SignedIn, SignedOut } from "@clerk/nextjs";

const SignUpPage = async () => {
  const currentAccount = await getCurrentAccountOrNull();
  return (
    <>
      <SignedIn>
        <WelcomeMessage account={currentAccount} />
      </SignedIn>
      <SignedOut>
        <SignUp />
      </SignedOut>
    </>
  );
};

export default SignUpPage;
