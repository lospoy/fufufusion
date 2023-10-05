// url/intent/aim-selection

import { type NextPage } from "next";
import { useUser } from "@clerk/nextjs";
import { PageLayout } from "~/components/layout";

import { AimFeed } from "~/components/aimFeed";

const IntentWizardAimSelection: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Return empty div if user isn't loaded yet
  if (!userLoaded || !isSignedIn) return <div>404 | Not Authorized</div>;

  return (
    <PageLayout>
      <div className="flex p-4">
        <AimFeed />
      </div>
    </PageLayout>
  );
};

export default IntentWizardAimSelection;
