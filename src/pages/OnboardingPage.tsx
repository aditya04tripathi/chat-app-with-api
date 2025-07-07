import { useConnectPartner, useGetUser } from "@/api/mutations";
import { withProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setUser } from "@/store/slices/user";
import type { User } from "@/types";
import { on } from "events";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const OnboardingPage = withProtectedRoute(() => {
  const [currentTab, setCurrentTab] = useState<"partner-details" | "done">("partner-details");
  const [partnerEmail, setPartnerEmail] = useState("");
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const connectPartner = useConnectPartner();
  const getUser = useGetUser();

  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    console.log(onboardingDone);
  }, [onboardingDone]);

  const checkIfOnboardingDone = async () => {
    try {
      const userResult = await getUser.mutateAsync(auth.accessToken!);
      return userResult;
    } catch (error: unknown) {
      // @ts-expect-error error might not have a message property
      toast.error(error?.message || "An error occurred while checking onboarding status.");
    }
  };

  useEffect(() => {
    checkIfOnboardingDone().then((userResult) => {
      if (userResult?.message?.onboarded) {
        dispatch(setUser(userResult.message as User));

        navigate("/");
      }
    });

    const interval = setInterval(() => {
      checkIfOnboardingDone().then((userResult) => {
        if (userResult?.message?.onboarded) {
          dispatch(setUser(userResult.message as User));

          navigate("/");
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const completeOnboarding = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!partnerEmail) {
      toast.error("Please enter your partner's email address.");
      return;
    }

    try {
      await connectPartner.mutateAsync({
        partnerEmail: partnerEmail,
        token: auth.accessToken!,
      });
      toast.success("Partner connected successfully! 🎉");

      await getUser.mutateAsync(auth.accessToken!).then((userResult) => {
        console.log("userResult", userResult);
        if (userResult?.message?.onboarded) {
          dispatch(setUser(userResult.message as User));
          console.log("Onboarding done");
          setOnboardingDone(true);
          setCurrentTab("done");
        } else {
          toast.error("Onboarding not completed. Please try again.");
        }
      });
    } catch (error: unknown) {
      // @ts-expect-error error might not have a message property
      toast.error(error?.message || "An error occurred during onboarding.");
    }
  };

  return (
    <div className="max-h-full px-10 md:px-0 w-screen h-full flex flex-col gap-4 items-center justify-center">
      <Tabs className="w-full md:w-1/2 h-1/2" value={currentTab} onValueChange={(tabValue) => setCurrentTab(tabValue as "partner-details" | "done")}>
        <TabsList className="w-full">
          <TabsTrigger disabled={currentTab !== "partner-details"} value="partner-details">
            Partner Details
          </TabsTrigger>
          <TabsTrigger disabled={currentTab !== "done"} value="done">
            Kudos
          </TabsTrigger>
        </TabsList>
        <div className="border rounded-xl p-5 h-full">
          <TabsContent className="relative h-full flex flex-col gap-4 items-stretch justify-center" value="partner-details">
            <form className="h-full flex flex-col gap-4 items-stretch justify-center" onClick={completeOnboarding}>
              <div>
                <h1>Tell us about your significant other</h1>
                <p className="text-sm text-muted-foreground">Enter your partner's email address so we can connect you both ✨</p>
              </div>
              <Input value={partnerEmail} onChange={(e) => setPartnerEmail(e.target.value)} placeholder="Enter your partner's email address" />
              <div className="absolute bottom-0 right-0 w-full flex justify-end">
                <Button type="submit" className="w-fit h-aut aspect-square" disabled={connectPartner.isPending || onboardingDone}>
                  {connectPartner.isPending || onboardingDone ? <Loader2 className="animate-spin" /> : <ChevronRight />}
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent className="relative h-full flex flex-col gap-4 items-center justify-center" value="done">
            <div className="flex flex-col items-center justify-center">
              <h1>Wonderful</h1>
              <p className="text-sm text-muted-foreground">You and your partner are now connected! 🎉</p>
            </div>
            <div className="absolute bottom-0 right-0 w-full flex justify-end">
              <Button disabled={!onboardingDone} onClick={() => navigate("/")} className="w-fit h-auto aspect-square">
                {!onboardingDone ? <Loader2 className="animate-spin" /> : <Check />}
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
});

export default OnboardingPage;
