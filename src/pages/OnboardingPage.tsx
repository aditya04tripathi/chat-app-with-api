import { withProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { connectPartnerThunk, getUserThunk } from "@/store/slices/user";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const OnboardingPage = withProtectedRoute(() => {
  const [currentTab, setCurrentTab] = useState<"partner-details" | "done">(
    "partner-details",
    // "done",
  );
  const [partnerEmail, setPartnerEmail] = useState("");
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    dispatch(getUserThunk(user.accessToken!)).then((data) => {
      if (data.payload.onboarded) navigate("/");
    });
  }, []);

  const connectToPartner = () => {
    if (!partnerEmail) {
      toast.error("Please enter your partner's email address.");
      return;
    }

    (() => {
      dispatch(
        connectPartnerThunk({
          partnerEmail: partnerEmail,
          token: user.accessToken!,
        }),
      ).then(() => {
        dispatch(getUserThunk(user.accessToken!)).then((data) => {
          if (data.payload.onboarded) {
            setOnboardingDone(true);
            toast.success("You and your partner are now connected! 🎉");
          }
        });
      });
    })();
    setCurrentTab("done");
  };

  return (
    <div className="max-h-screen px-10 md:px-0 w-screen h-screen flex flex-col gap-4 items-center justify-center">
      <Tabs
        className="w-full md:w-1/2 h-1/2"
        value={currentTab}
        onValueChange={(tabValue) =>
          setCurrentTab(tabValue as "partner-details" | "done")
        }
      >
        <TabsList className="w-full">
          <TabsTrigger
            disabled={currentTab !== "partner-details"}
            value="partner-details"
          >
            Partner Details
          </TabsTrigger>
          <TabsTrigger disabled={currentTab !== "done"} value="done">
            Kudos
          </TabsTrigger>
        </TabsList>
        <div className="border rounded-xl p-5 h-full">
          <TabsContent
            className="relative h-full flex flex-col gap-4 items-stretch justify-center"
            value="partner-details"
          >
            <div>
              <h1>Tell us about your significant other</h1>
              <p className="text-sm text-muted-foreground">
                Enter your partner's email address so we can connect you both ✨
              </p>
            </div>
            <Input
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              placeholder="Enter your partner's email address"
            />
            <div className="absolute bottom-0 right-0 w-full flex justify-end">
              <Button
                onClick={connectToPartner}
                className="w-fit h-aut aspect-square"
              >
                <ChevronRight />
              </Button>
            </div>
          </TabsContent>
          <TabsContent
            className="relative h-full flex flex-col gap-4 items-center justify-center"
            value="done"
          >
            <div className="flex flex-col items-center justify-center">
              <h1>Wonderful</h1>
              <p className="text-sm text-muted-foreground">
                You and your partner are now connected! 🎉
              </p>
            </div>
            <div className="absolute bottom-0 right-0 w-full flex justify-end">
              <Button
                disabled={!onboardingDone}
                onClick={() => navigate("/")}
                className="w-fit h-auto aspect-square"
              >
                {!onboardingDone ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Check />
                )}
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
});

export default OnboardingPage;
