// @/app/(authenticated)/(session)/user-profile/[[...user-profile]]/page.tsx

import { siteNavigation } from "@/config/navigation";
import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => {
  return <UserProfile path={siteNavigation.userProfile.href} routing="path" />;
};

export default UserProfilePage;
