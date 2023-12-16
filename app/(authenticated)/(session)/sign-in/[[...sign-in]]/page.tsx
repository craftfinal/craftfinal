import { getCurrentAccountOrNull } from "@/actions/user";
import WelcomeMessage from "@/app/(authenticated)/(session)/WelcomeMessage";
import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";

const SignInPage = async () => {
  const currentAccount = await getCurrentAccountOrNull();
  return (
    <>
      <SignedIn>
        <WelcomeMessage account={currentAccount} />
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </>
  );
};

export default SignInPage;
