import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNav from "@/components/BottomNav";
import { LogOut } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  plan: string;
  remaining: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [currentBattery, setCurrentBattery] = useState(50); // Mock current battery level
  const [chargePercent, setChargePercent] = useState([50]); // Start at current battery
  const [planType, setPlanType] = useState<"prepaid" | "payg">("prepaid");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleStartCharging = () => {
    if (planType === "payg") {
      // In real app, integrate with Razorpay here
      navigate("/charging", { state: { chargePercent: chargePercent[0], initialBattery: currentBattery } });
    } else {
      navigate("/charging", { state: { chargePercent: 100, initialBattery: currentBattery } });
    }
  };

  const costPerKWh = 10;
  const chargeToAdd = chargePercent[0] - currentBattery;
  const estimatedCost = Math.round((chargeToAdd / 100) * 5 * costPerKWh);

  if (!user) return null;

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Energion</h1>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        <Card className="p-6 shadow-card gradient-card mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            Hi {user.name} 👋
          </h2>

          <Tabs value={planType} onValueChange={(v) => setPlanType(v as "prepaid" | "payg")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="prepaid">Prepaid Plan</TabsTrigger>
              <TabsTrigger value="payg">Pay as you go</TabsTrigger>
            </TabsList>

            <TabsContent value="prepaid" className="space-y-4">
              <div className="bg-secondary/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Remaining Balance</p>
                <p className="text-2xl font-bold text-primary">{user.remaining} kWh</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/plans")}
                >
                  Recharge
                </Button>
                <Button
                  variant="action"
                  size="lg"
                  onClick={handleStartCharging}
                >
                  Start Charging
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="payg" className="space-y-4">
              <div className="space-y-4">
                <div className="bg-secondary/30 rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Current Battery Level</p>
                  <p className="text-3xl font-bold text-foreground">{currentBattery}%</p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Target Charge Level
                  </label>
                  <Slider
                    value={chargePercent}
                    onValueChange={(value) => {
                      // Prevent slider from going below current battery level
                      if (value[0] >= currentBattery) {
                        setChargePercent(value);
                      }
                    }}
                    min={0}
                    max={100}
                    step={5}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0%</span>
                    <span className="text-primary font-semibold">{chargePercent[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    {chargeToAdd > 0 ? `Charging for ${chargeToAdd}%` : "Charging for"}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{estimatedCost}
                  </p>
                </div>

                <Button
                  variant="action"
                  size="lg"
                  className="w-full"
                  onClick={handleStartCharging}
                >
                  Proceed to Pay & Start Charging
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
